import { create } from 'zustand';
import type { Payment } from '../types';
import * as paymentsApi from '../api/payments';
import { isApiError } from '../api/errors';

interface PaymentsHistoryState {
  items: Payment[];
  total: number;
  loading: boolean;
  error: string | null;
  load: (userId: string, params?: { limit?: number; offset?: number }) => Promise<void>;
  /**
   * Refresh pending payments. Returns `true` when at least one payment in the
   * store is still `pending`. Used by `usePaymentsPolling` to decide whether
   * to keep polling.
   */
  pollPending: (userId: string) => Promise<boolean>;
}

function toErrorMessage(e: unknown, fallback: string): string {
  if (isApiError(e)) return e.message || fallback;
  if (e instanceof Error) return e.message || fallback;
  return fallback;
}

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

function hasRecentPending(items: Payment[], now = Date.now()): boolean {
  return items.some((p) => {
    if (p.status !== 'pending') return false;
    const t = Date.parse(p.transaction_date);
    if (!Number.isFinite(t)) return true; // unknown date -> still consider pending
    return now - t < ONE_DAY_MS;
  });
}

export const usePaymentsHistoryStore = create<PaymentsHistoryState>((set, get) => ({
  items: [],
  total: 0,
  loading: false,
  error: null,
  load: async (userId, params = {}) => {
    set({ loading: true, error: null });
    try {
      const { items, total } = await paymentsApi.listMine(userId, params);
      set({ items, total, loading: false });
    } catch (e) {
      set({ loading: false, error: toErrorMessage(e, 'Failed to load payments') });
    }
  },
  pollPending: async (userId) => {
    try {
      const { items } = await paymentsApi.listMine(userId, { limit: 50 });
      set({ items, total: items.length });
      return hasRecentPending(items);
    } catch {
      // best-effort: keep existing state and signal "no more pending" so we
      // don't spin on a failing endpoint.
      return hasRecentPending(get().items);
    }
  },
}));

export { hasRecentPending };
