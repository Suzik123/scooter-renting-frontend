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
}

function toErrorMessage(e: unknown, fallback: string): string {
  if (isApiError(e)) return e.message || fallback;
  if (e instanceof Error) return e.message || fallback;
  return fallback;
}

export const usePaymentsHistoryStore = create<PaymentsHistoryState>((set) => ({
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
}));
