import { create } from 'zustand';
import type { Scooter } from '../types';
import * as scootersApi from '../api/scooters';
import { isApiError } from '../api/errors';
import { toNum } from '../lib/decimal';

export type ScooterFilter = 'All' | 'Nearest' | 'Best Battery' | 'Cheapest';

interface ScootersState {
  scooters: Scooter[];
  selectedScooterId: string | null;
  filter: ScooterFilter;
  userLocation: { lat: number; lng: number } | null;
  recenterAt: number;
  loading: boolean;
  error: string | null;
  geoDenied: boolean;
  loadScooters: (location?: { lat: number; lng: number }) => Promise<void>;
  selectScooter: (id: string) => void;
  setFilter: (f: ScooterFilter) => void;
  setGeoDenied: (denied: boolean) => void;
  setUserLocation: (loc: { lat: number; lng: number } | null) => void;
  requestRecenter: () => void;
}

function toErrorMessage(e: unknown, fallback: string): string {
  if (isApiError(e)) return e.message || fallback;
  if (e instanceof Error) return e.message || fallback;
  return fallback;
}

function isAvailable(s: Scooter): boolean {
  return s.status === 'available';
}

export const useScootersStore = create<ScootersState>((set, get) => ({
  scooters: [],
  selectedScooterId: null,
  filter: 'All',
  userLocation: null,
  recenterAt: 0,
  loading: false,
  error: null,
  geoDenied: false,
  loadScooters: async (location) => {
    set({ loading: true, error: null });
    try {
      let scooters: Scooter[];
      if (location) {
        const res = await scootersApi.nearbyScooters({ lat: location.lat, lng: location.lng, radius: 2000 });
        scooters = res.items;
        set({ userLocation: location, geoDenied: false });
      } else {
        const res = await scootersApi.listScooters({ status: 'available', limit: 50 });
        scooters = res.items;
      }
      const selectedId = get().selectedScooterId;
      const stillSelected = selectedId && scooters.some((s) => s.scooter_id === selectedId);
      set({
        scooters,
        selectedScooterId: stillSelected
          ? selectedId
          : scooters.find(isAvailable)?.scooter_id ?? null,
        loading: false,
      });
    } catch (e) {
      set({ loading: false, error: toErrorMessage(e, 'Failed to load scooters') });
    }
  },
  selectScooter: (id) => set({ selectedScooterId: id }),
  setFilter: (f) => set({ filter: f }),
  setGeoDenied: (denied) => set({ geoDenied: denied }),
  setUserLocation: (loc) => set({ userLocation: loc }),
  requestRecenter: () => set({ recenterAt: Date.now() }),
}));

function distanceMeters(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const toRad = (n: number) => (n * Math.PI) / 180;
  const R = 6371000;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

function sortByFilter(
  scooters: Scooter[],
  filter: ScooterFilter,
  origin: { lat: number; lng: number } | null,
): Scooter[] {
  const arr = [...scooters];
  switch (filter) {
    case 'Nearest':
      if (!origin) return arr;
      return arr.sort(
        (a, b) =>
          distanceMeters(origin, { lat: toNum(a.lat), lng: toNum(a.lng) }) -
          distanceMeters(origin, { lat: toNum(b.lat), lng: toNum(b.lng) }),
      );
    case 'Best Battery':
      return arr.sort((a, b) => b.battery_level - a.battery_level);
    case 'Cheapest':
      // Backend doesn't expose price-per-scooter on the list endpoint;
      // until that lands we leave order untouched for this filter.
      return arr;
    default:
      return arr;
  }
}

export function useAvailableScooters(): Scooter[] {
  const scooters = useScootersStore((s) => s.scooters);
  const filter = useScootersStore((s) => s.filter);
  const origin = useScootersStore((s) => s.userLocation);
  const available = scooters.filter(isAvailable);
  return sortByFilter(available, filter, origin);
}

export function useBestMatch(): Scooter | undefined {
  const available = useAvailableScooters();
  return available[0];
}

export function distanceFromUser(scooter: Scooter, origin: { lat: number; lng: number } | null): string {
  if (!origin) return '—';
  const meters = distanceMeters(origin, { lat: toNum(scooter.lat), lng: toNum(scooter.lng) });
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}
