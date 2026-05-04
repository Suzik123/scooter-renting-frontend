import { create } from 'zustand';
import type { Rental } from '../types';
import * as usersApi from '../api/users';
import { isApiError } from '../api/errors';
import { formatCost as formatCostDecimal, type DecimalLike } from '../lib/decimal';

export type HistoryFilter = 'All' | 'This Week' | 'Last Week' | 'This Month';

interface RideHistoryState {
  rides: Rental[];
  filter: HistoryFilter;
  loading: boolean;
  error: string | null;
  loadHistory: (userId: string, params?: { limit?: number; offset?: number }) => Promise<void>;
  setFilter: (f: HistoryFilter) => void;
  clear: () => void;
}

function toErrorMessage(e: unknown, fallback: string): string {
  if (isApiError(e)) return e.message || fallback;
  if (e instanceof Error) return e.message || fallback;
  return fallback;
}

export const useRideHistoryStore = create<RideHistoryState>((set) => ({
  rides: [],
  filter: 'All',
  loading: false,
  error: null,
  loadHistory: async (userId, params = {}) => {
    set({ loading: true, error: null });
    try {
      const { items } = await usersApi.listUserRentals(userId, params);
      set({ rides: items, loading: false });
    } catch (e) {
      set({ loading: false, error: toErrorMessage(e, 'Failed to load history') });
    }
  },
  setFilter: (f) => set({ filter: f }),
  clear: () => set({ rides: [], filter: 'All', error: null }),
}));

function parseDate(r: Rental): Date | null {
  const raw = r.end_time || r.start_time;
  if (!raw) return null;
  const d = new Date(raw);
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

export function useFilteredRides(): Rental[] {
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

function dateLabel(d: Date): string {
  const today = startOfDay(new Date());
  const day = startOfDay(d);
  const diffDays = Math.round((today.getTime() - day.getTime()) / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return 'This Week';
  if (diffDays < 14) return 'Last Week';
  if (d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()) return 'This Month';
  return 'Older';
}

export function useGroupedRides(): Record<string, Rental[]> {
  const rides = useFilteredRides();
  return rides.reduce<Record<string, Rental[]>>((acc, r) => {
    const d = parseDate(r);
    const key = d ? dateLabel(d) : 'Older';
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});
}

export function useLastRide(): Rental | undefined {
  const rides = useRideHistoryStore((s) => s.rides);
  return rides[0];
}

export function rentalDurationSeconds(r: Rental): number {
  if (!r.start_time) return 0;
  const start = Date.parse(r.start_time);
  const end = r.end_time ? Date.parse(r.end_time) : Date.now();
  if (!Number.isFinite(start) || !Number.isFinite(end)) return 0;
  return Math.max(0, Math.floor((end - start) / 1000));
}

export function formatDurationLabel(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins >= 60) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatDistance(meters?: number): string {
  if (!meters || meters <= 0) return '—';
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

// Re-export the decimal-aware formatter so existing callers
// (HistoryRideRow, LastRideCard, RideDetailCostBreakdown, ...) keep working.
// The wire format is a JSON string, but legacy callers may still pass numbers.
export function formatCost(amount?: DecimalLike, currency: string = 'USD'): string {
  return formatCostDecimal(amount, currency);
}

export function rentalDateLabel(r: Rental): string {
  const d = parseDate(r);
  if (!d) return '—';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
