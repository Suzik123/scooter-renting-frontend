import { create } from 'zustand';
import type { PaymentMethod } from '../types';
import * as paymentsApi from '../api/payments';
import { isApiError } from '../api/errors';

interface PaymentMethodsState {
  methods: PaymentMethod[];
  loading: boolean;
  error: string | null;
  loaded: boolean;
  load: () => Promise<void>;
  remove: (id: string) => Promise<void>;
}

function toErrorMessage(e: unknown, fallback: string): string {
  if (isApiError(e)) return e.message || fallback;
  if (e instanceof Error) return e.message || fallback;
  return fallback;
}

export const usePaymentMethodsStore = create<PaymentMethodsState>((set, get) => ({
  methods: [],
  loading: false,
  error: null,
  loaded: false,
  load: async () => {
    set({ loading: true, error: null });
    try {
      const { methods } = await paymentsApi.listMethods();
      set({ methods, loading: false, loaded: true });
    } catch (e) {
      set({ loading: false, error: toErrorMessage(e, 'Failed to load payment methods') });
    }
  },
  remove: async (id) => {
    const prev = get().methods;
    set({ methods: prev.filter((m) => m.id !== id) });
    try {
      await paymentsApi.deleteMethod(id);
    } catch (e) {
      set({ methods: prev, error: toErrorMessage(e, 'Failed to remove card') });
    }
  },
}));
