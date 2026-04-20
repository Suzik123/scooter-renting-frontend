import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Ride, UserStats } from '../types';
import { rideHistory as mockRides, userStats as mockStats } from '../mock/data';

export type HistoryFilter = 'All' | 'This Week' | 'Last Week' | 'This Month';

interface RideHistoryState {
  rides: Ride[];
  filter: HistoryFilter;
  stats: UserStats;
  loading: boolean;
  error: string | null;
  loadHistory: () => Promise<void>;
  addRide: (ride: Ride) => void;
  rateRide: (id: string, rating: number) => void;
  setFilter: (f: HistoryFilter) => void;
}

export const useRideHistoryStore = create<RideHistoryState>()(
  persist(
    (set) => ({
      rides: mockRides,
      filter: 'All',
      stats: mockStats,
      loading: false,
      error: null,
      loadHistory: async () => {
        set({ loading: true, error: null });
        set({ loading: false });
      },
      addRide: (ride) => set((s) => ({ rides: [ride, ...s.rides] })),
      rateRide: (id, rating) =>
        set((s) => ({
          rides: s.rides.map((r) => (r.id === id ? { ...r, rating } : r)),
        })),
      setFilter: (f) => set({ filter: f }),
    }),
    { name: 'uniscoot-rides' },
  ),
);

function parseDuration(d: string): number {
  if (d.includes(':')) {
    const [mm, ss] = d.split(':').map(Number);
    return (mm || 0) * 60 + (ss || 0);
  }
  const m = parseFloat(d);
  return Number.isNaN(m) ? 0 : m * 60;
}

function parseDate(r: Ride): Date | null {
  if (!r.date) return null;
  const d = new Date(r.date);
  return Number.isNaN(d.getTime()) ? null : d;
}

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function startOfWeek(d: Date): Date {
  const x = startOfDay(d);
  const day = x.getDay();
  const diff = (day + 6) % 7;
  x.setDate(x.getDate() - diff);
  return x;
}

export function useLastRide(): Ride | undefined {
  const rides = useRideHistoryStore((s) => s.rides);
  return rides[0];
}

export function useFilteredRides(): Ride[] {
  const rides = useRideHistoryStore((s) => s.rides);
  const filter = useRideHistoryStore((s) => s.filter);
  if (filter === 'All') return rides;
  const now = new Date();
  const thisWeekStart = startOfWeek(now);
  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  return rides.filter((r) => {
    const d = parseDate(r);
    if (!d) return false;
    if (filter === 'This Week') return d >= thisWeekStart;
    if (filter === 'Last Week') return d >= lastWeekStart && d < thisWeekStart;
    if (filter === 'This Month') return d >= thisMonthStart;
    return true;
  });
}

export function useGroupedRides(): Record<string, Ride[]> {
  const rides = useFilteredRides();
  return rides.reduce<Record<string, Ride[]>>((acc, r) => {
    const key = r.dateLabel || r.date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});
}

export function useTotalRideTime(): string {
  const rides = useRideHistoryStore((s) => s.rides);
  const totalSeconds = rides.reduce((sum, r) => sum + parseDuration(r.duration), 0);
  const hours = totalSeconds / 3600;
  if (hours >= 1) return `${hours.toFixed(1)}h`;
  const mins = Math.round(totalSeconds / 60);
  return `${mins}m`;
}
