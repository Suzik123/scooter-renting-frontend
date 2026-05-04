import { create } from 'zustand';
import type { PriceModel } from '../types';
import * as priceModelsApi from '../api/priceModels';
import { isApiError } from '../api/errors';
import { toNum } from '../lib/decimal';

interface PriceModelsState {
  models: PriceModel[];
  loading: boolean;
  error: string | null;
  loaded: boolean;
  load: () => Promise<void>;
}

function toErrorMessage(e: unknown, fallback: string): string {
  if (isApiError(e)) return e.message || fallback;
  if (e instanceof Error) return e.message || fallback;
  return fallback;
}

export const usePriceModelsStore = create<PriceModelsState>((set) => ({
  models: [],
  loading: false,
  error: null,
  loaded: false,
  load: async () => {
    set({ loading: true, error: null });
    try {
      const { items } = await priceModelsApi.listPriceModels();
      set({ models: items, loading: false, loaded: true });
    } catch (e) {
      set({ loading: false, error: toErrorMessage(e, 'Failed to load price models') });
    }
  },
}));

export function pickDefaultPriceModel(models: PriceModel[]): PriceModel | null {
  if (models.length === 0) return null;
  const sorted = [...models].sort(
    (a, b) => toNum(a.price_per_minute) - toNum(b.price_per_minute),
  );
  return sorted[0];
}
