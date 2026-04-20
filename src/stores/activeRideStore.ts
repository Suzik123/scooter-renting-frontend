import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Scooter, Ride } from '../types';
import { useWalletStore } from './walletStore';
import { useRideHistoryStore } from './rideHistoryStore';

export const PRICING = {
  unlockFee: 1.0,
  ratePerMin: 0.29,
};

export interface ActiveRide {
  scooterId: string;
  scooterName: string;
  battery: number;
  startedAt: number;
  fromLabel: string;
}

interface ActiveRideState {
  activeRide: ActiveRide | null;
  elapsedSeconds: number;
  currentCost: number;
  loading: boolean;
  error: string | null;
  startRide: (scooter: Scooter, fromLabel?: string) => Promise<void>;
  endRide: () => Promise<Ride | null>;
  cancelRide: () => void;
  _tick: () => void;
}

let tickerId: ReturnType<typeof setInterval> | null = null;

function computeCost(elapsedSeconds: number): number {
  return PRICING.unlockFee + PRICING.ratePerMin * (elapsedSeconds / 60);
}

function formatDuration(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export const useActiveRideStore = create<ActiveRideState>()(
  persist(
    (set, get) => ({
      activeRide: null,
      elapsedSeconds: 0,
      currentCost: PRICING.unlockFee,
      loading: false,
      error: null,
      _tick: () => {
        const ride = get().activeRide;
        if (!ride) return;
        const elapsed = Math.floor((Date.now() - ride.startedAt) / 1000);
        set({ elapsedSeconds: elapsed, currentCost: computeCost(elapsed) });
      },
      startRide: async (scooter, fromLabel = 'Current Location') => {
        set({ loading: true, error: null });
        try {
          const startedAt = Date.now();
          const activeRide: ActiveRide = {
            scooterId: scooter.id,
            scooterName: scooter.name,
            battery: scooter.battery,
            startedAt,
            fromLabel,
          };
          set({ activeRide, elapsedSeconds: 0, currentCost: PRICING.unlockFee, loading: false });
          ensureTicker();
        } catch (e) {
          set({ loading: false, error: 'Failed to start ride' });
        }
      },
      endRide: async () => {
        const ride = get().activeRide;
        if (!ride) return null;
        stopTicker();
        set({ loading: true, error: null });
        try {
          const elapsed = Math.floor((Date.now() - ride.startedAt) / 1000);
          const cost = computeCost(elapsed);
          const durationLabel = formatDuration(elapsed);
          const distanceKm = Math.max(0.1, (elapsed / 60) * 0.18);
          const avgSpeed = elapsed > 0 ? (distanceKm / (elapsed / 3600)) : 0;
          const now = new Date();
          const finished: Ride = {
            id: `r-${Date.now()}`,
            scooterName: ride.scooterName,
            scooterId: ride.scooterId,
            from: ride.fromLabel,
            to: 'Destination',
            date: now.toISOString().slice(0, 10),
            dateLabel: 'Today',
            duration: durationLabel,
            distance: `${distanceKm.toFixed(1)} km`,
            cost: `$${cost.toFixed(2)}`,
            avgSpeed: `${avgSpeed.toFixed(1)} km/h`,
            maxSpeed: `${(avgSpeed * 1.6).toFixed(0)} km/h`,
            rating: 0,
            status: 'completed',
            co2Saved: `${(distanceKm * 0.2).toFixed(1)} kg`,
          };
          useRideHistoryStore.getState().addRide(finished);
          await useWalletStore.getState().chargeRide(cost, finished.id);
          set({ activeRide: null, elapsedSeconds: 0, currentCost: PRICING.unlockFee, loading: false });
          return finished;
        } catch (e) {
          set({ loading: false, error: 'Failed to end ride' });
          return null;
        }
      },
      cancelRide: () => {
        stopTicker();
        set({ activeRide: null, elapsedSeconds: 0, currentCost: PRICING.unlockFee });
      },
    }),
    {
      name: 'uniscoot-active-ride',
      partialize: (s) => ({ activeRide: s.activeRide }),
      onRehydrateStorage: () => (state) => {
        if (state?.activeRide) {
          // Derive elapsed from wall-clock so the timer is correct after refresh
          const elapsed = Math.floor((Date.now() - state.activeRide.startedAt) / 1000);
          state.elapsedSeconds = elapsed;
          state.currentCost = computeCost(elapsed);
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
