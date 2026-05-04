import { request } from './client';
import type { Scooter } from '../types';

export interface ScootersListResponse {
  items: Scooter[];
  total: number;
}

export interface ListScootersParams {
  status?: string;
  zone_id?: string;
  limit?: number;
  offset?: number;
}

export function listScooters(params: ListScootersParams = {}): Promise<ScootersListResponse> {
  return request<ScootersListResponse>('/api/scooters', { query: { ...params } });
}

export interface NearbyScootersParams {
  lat: number;
  lng: number;
  radius?: number;
}

export function nearbyScooters(params: NearbyScootersParams): Promise<ScootersListResponse> {
  return request<ScootersListResponse>('/api/scooters/nearby', { query: { ...params } });
}

export function getScooter(scooterId: string): Promise<Scooter> {
  return request<Scooter>(`/api/scooters/${scooterId}`);
}
