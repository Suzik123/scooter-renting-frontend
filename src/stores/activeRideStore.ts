import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Scooter, Rental, PaymentResult } from '../types';
import * as rentalsApi from '../api/rentals';
import { isApiError } from '../api/errors';

export interface ActiveRide {
  rental_id: string;
  scooter_id: string;
  scooter_label: string;
  battery_level: number;
  price_model_id: string;
  price_per_minute: number;
  unlock_fee: number;
  currency: string;
  start_time: string; // ISO
  startedAtMs: number; // for fast elapsed calculation
}

interface ActiveRideState {
  activeRide: ActiveRide | null;
  elapsedSeconds: number;
  currentCost: number;
  loading: boolean;
  error: string | null;
  needsCard: boolean;
  hasOutstanding: boolean;
  finishedRental: Rental | null;
  finishedPayment: PaymentResult | null;
  startRide: (
    scooter: Scooter,
    priceModel: { price_model_id: string; price_per_minute: number; unlock_fee: number; currency: string },
  ) => Promise<Rental | null>;
  endRide: () => Promise<{ rental: Rental; payment: PaymentResult } | null>;
  clearFlags: () => void;
  clearFinished: () => void;
  cancelRide: () => void;
  _tick: () => void;
}

let tickerId: ReturnType<typeof setInterval> | null = null;

function getCurrentPosition(timeoutMs = 5000): Promise<GeolocationPosition | null> {
  if (typeof navigator === 'undefined' || !navigator.geolocation) return Promise.resolve(null);
  return new Promise((resolve) => {
    let settled = false;
    const t = setTimeout(() => {
      if (!settled) {
        settled = true;
        resolve(null);
      }
    }, timeoutMs);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!settled) {
          settled = true;
          clearTimeout(t);
          resolve(pos);
        }
      },
      () => {
        if (!settled) {
          settled = true;
          clearTimeout(t);
          resolve(null);
        }
      },
      { enableHighAccuracy: false, maximumAge: 30000, timeout: timeoutMs },
    );
  });
}

function computeCost(elapsedSeconds: number, ride: ActiveRide): number {
  return ride.unlock_fee + ride.price_per_minute * (elapsedSeconds / 60);
}

function toErrorMessage(e: unknown, fallback: string): string {
  if (isApiError(e)) return e.message || fallback;
  if (e instanceof Error) return e.message || fallback;
  return fallback;
}

export const useActiveRideStore = create<ActiveRideState>()(
  persist(
    (set, get) => ({
      activeRide: null,
      elapsedSeconds: 0,
      currentCost: 0,
      loading: false,
      error: null,
      needsCard: false,
      hasOutstanding: false,
      finishedRental: null,
      finishedPayment: null,
      _tick: () => {
        const ride = get().activeRide;
        if (!ride) return;
        const elapsed = Math.floor((Date.now() - ride.startedAtMs) / 1000);
        set({ elapsedSeconds: elapsed, currentCost: computeCost(elapsed, ride) });
      },
      startRide: async (scooter, priceModel) => {
        set({ loading: true, error: null, needsCard: false, hasOutstanding: false });
        try {
          const pos = await getCurrentPosition();
          const rental = await rentalsApi.startRental({
            scooter_id: scooter.scooter_id,
            price_model_id: priceModel.price_model_id,
            start_lat: pos?.coords.latitude,
            start_lon: pos?.coords.longitude,
          });
          const startedAtMs = rental.start_time ? Date.parse(rental.start_time) : Date.now();
          const activeRide: ActiveRide = {
            rental_id: rental.rental_id,
            scooter_id: scooter.scooter_id,
            scooter_label: scooter.model || `Scooter ${scooter.scooter_id}`,
            battery_level: scooter.battery_level,
            price_model_id: priceModel.price_model_id,
            price_per_minute: priceModel.price_per_minute,
            unlock_fee: priceModel.unlock_fee,
            currency: priceModel.currency,
            start_time: rental.start_time ?? new Date().toISOString(),
            startedAtMs: Number.isFinite(startedAtMs) ? startedAtMs : Date.now(),
          };
          set({
            activeRide,
            elapsedSeconds: 0,
            currentCost: priceModel.unlock_fee,
            loading: false,
          });
          ensureTicker();
          return rental;
        } catch (e) {
          if (isApiError(e)) {
            if (e.kind === 'add_card_required') {
              set({ loading: false, error: e.message, needsCard: true });
              return null;
            }
            if (e.kind === 'outstanding_balance') {
              set({ loading: false, error: e.message, hasOutstanding: true });
              return null;
            }
          }
          set({ loading: false, error: toErrorMessage(e, 'Failed to start ride') });
          return null;
        }
      },
      endRide: async () => {
        const ride = get().activeRide;
        if (!ride) return null;
        set({ loading: true, error: null });
        try {
          const pos = await getCurrentPosition();
          const result = await rentalsApi.endRental(ride.rental_id, {
            end_lat: pos?.coords.latitude,
            end_lon: pos?.coords.longitude,
          });
          stopTicker();
          set({
            activeRide: null,
            elapsedSeconds: 0,
            currentCost: 0,
            loading: false,
            finishedRental: result.rental,
            finishedPayment: result.payment,
          });
          return result;
        } catch (e) {
          set({ loading: false, error: toErrorMessage(e, 'Failed to end ride') });
          return null;
        }
      },
      clearFlags: () => set({ needsCard: false, hasOutstanding: false, error: null }),
      clearFinished: () => set({ finishedRental: null, finishedPayment: null }),
      cancelRide: () => {
        stopTicker();
        set({ activeRide: null, elapsedSeconds: 0, currentCost: 0 });
      },
    }),
    {
      name: 'uniscoot-active-ride',
      partialize: (s) => ({ activeRide: s.activeRide }),
      onRehydrateStorage: () => (state) => {
        if (state?.activeRide) {
          const elapsed = Math.floor((Date.now() - state.activeRide.startedAtMs) / 1000);
          state.elapsedSeconds = elapsed;
          state.currentCost = computeCost(elapsed, state.activeRide);
          ensureTicker();
        }
      },
    },
  ),
);

function ensureTicker() {
  if (tickerId) return;
  tickerId = setInterval(() => {
    useActiveRideStore.getState()._tick();
  }, 1000);
}

function stopTicker() {
  if (tickerId) {
    clearInterval(tickerId);
    tickerId = null;
  }
}

export function formatElapsed(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
