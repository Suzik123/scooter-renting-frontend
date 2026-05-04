import { request } from './client';
import type { Zone } from '../types';

export interface ZonesResponse {
  items: Zone[];
  total: number;
}

export function listZones(): Promise<ZonesResponse> {
  return request<ZonesResponse>('/api/zones');
}
