import { create } from 'zustand';
import type { Zone } from '../types';
import * as zonesApi from '../api/zones';
import { isApiError } from '../api/errors';

interface ZonesState {
  zones: Zone[];
  loaded: boolean;
  loading: boolean;
  error: string | null;
  load: () => Promise<void>;
}

function toErrorMessage(e: unknown, fallback: string): string {
  if (isApiError(e)) return e.message || fallback;
  if (e instanceof Error) return e.message || fallback;
  return fallback;
}

export const useZonesStore = create<ZonesState>((set, get) => ({
  zones: [],
  loaded: false,
  loading: false,
  error: null,
  load: async () => {
    if (get().loading) return;
    set({ loading: true, error: null });
    try {
      const { items } = await zonesApi.listZones();
      set({ zones: items, loaded: true, loading: false });
    } catch (e) {
      set({ loading: false, error: toErrorMessage(e, 'Failed to load zones') });
    }
  },
}));
