import { create } from 'zustand';
import type { Scooter } from '../types';
import { scooters as mockScooters } from '../mock/data';

export type ScooterFilter = 'All' | 'Nearest' | 'Best Battery' | 'Cheapest';

interface ScootersState {
  scooters: Scooter[];
  selectedScooterId: string | null;
  filter: ScooterFilter;
  loading: boolean;
  error: string | null;
  loadScooters: () => Promise<void>;
  selectScooter: (id: string) => void;
  setFilter: (f: ScooterFilter) => void;
}

export const useScootersStore = create<ScootersState>((set) => ({
  scooters: mockScooters,
  selectedScooterId: mockScooters[0]?.id ?? null,
  filter: 'All',
  loading: false,
  error: null,
  loadScooters: async () => {
    set({ loading: true, error: null });
    set({ scooters: mockScooters, loading: false });
  },
  selectScooter: (id) => set({ selectedScooterId: id }),
  setFilter: (f) => set({ filter: f }),
}));

function parseDistance(d: string): number {
  const s = d.toLowerCase().trim();
  const num = parseFloat(s);
  if (Number.isNaN(num)) return Number.POSITIVE_INFINITY;
  if (s.includes('km')) return num * 1000;
  return num;
}

function parsePrice(p: string): number {
  const num = parseFloat(p.replace(/[^0-9.]/g, ''));
  return Number.isNaN(num) ? Number.POSITIVE_INFINITY : num;
}

function sortByFilter(scooters: Scooter[], filter: ScooterFilter): Scooter[] {
  const arr = [...scooters];
  switch (filter) {
    case 'Nearest':
      return arr.sort((a, b) => parseDistance(a.distance) - parseDistance(b.distance));
    case 'Best Battery':
      return arr.sort((a, b) => b.battery - a.battery);
    case 'Cheapest':
      return arr.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    default:
      return arr;
  }
}

export function useAvailableScooters(): Scooter[] {
  const scooters = useScootersStore((s) => s.scooters);
  const filter = useScootersStore((s) => s.filter);
  const available = scooters.filter((s) => s.status === 'available');
  return sortByFilter(available, filter);
}

export function useBestMatch(): Scooter | undefined {
  const available = useAvailableScooters();
  return available[0];
}
