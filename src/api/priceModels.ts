import { request } from './client';
import type { PriceModel } from '../types';

export interface PriceModelsResponse {
  items: PriceModel[];
  total: number;
}

export function listPriceModels(): Promise<PriceModelsResponse> {
  return request<PriceModelsResponse>('/api/price-models');
}
