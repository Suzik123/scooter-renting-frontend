import { request } from './client';
import type { User, Rental, Payment } from '../types';

export function getUser(userId: string): Promise<User> {
  return request<User>(`/api/users/${userId}`);
}

export interface UpdateUserPayload {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
}

export function updateUser(userId: string, payload: UpdateUserPayload): Promise<User> {
  return request<User>(`/api/users/${userId}`, { method: 'PUT', body: payload });
}

export function deleteUser(userId: string): Promise<void> {
  return request<void>(`/api/users/${userId}`, { method: 'DELETE' });
}

export interface ListRentalsParams {
  limit?: number;
  offset?: number;
}

export interface RentalsResponse {
  items: Rental[];
  total: number;
}

export function listUserRentals(
  userId: string,
  params: ListRentalsParams = {},
): Promise<RentalsResponse> {
  return request<RentalsResponse>(`/api/users/${userId}/rentals`, { query: { ...params } });
}

export interface ListPaymentsParams {
  limit?: number;
  offset?: number;
}

export interface PaymentsResponse {
  items: Payment[];
  total: number;
}

export function listUserPayments(
  userId: string,
  params: ListPaymentsParams = {},
): Promise<PaymentsResponse> {
  return request<PaymentsResponse>(`/api/users/${userId}/payments`, {
    query: { ...params },
  });
}
