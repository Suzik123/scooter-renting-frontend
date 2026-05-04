import { request } from './client';
import type { PaymentMethod } from '../types';
import { listUserPayments, type PaymentsResponse, type ListPaymentsParams } from './users';

export interface SetupIntentResponse {
  client_secret: string;
  setup_intent_id: string;
}

export function createSetupIntent(): Promise<SetupIntentResponse> {
  return request<SetupIntentResponse>('/api/payments/setup-intent', { method: 'POST' });
}

export interface PaymentMethodsResponse {
  methods: PaymentMethod[];
}

export function listMethods(): Promise<PaymentMethodsResponse> {
  return request<PaymentMethodsResponse>('/api/payments/methods');
}

export function deleteMethod(pmId: string): Promise<void> {
  return request<void>(`/api/payments/methods/${pmId}`, { method: 'DELETE' });
}

export function listMine(
  userId: string,
  params: ListPaymentsParams = {},
): Promise<PaymentsResponse> {
  return listUserPayments(userId, params);
}
