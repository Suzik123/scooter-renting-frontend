import { request } from './client';
import type { Rental, PaymentResult } from '../types';

export interface StartRentalPayload {
  scooter_id: string;
  price_model_id: string;
  start_lat?: number;
  start_lon?: number;
}

export function startRental(payload: StartRentalPayload): Promise<Rental> {
  return request<Rental>('/api/rentals', { method: 'POST', body: payload });
}

export interface EndRentalPayload {
  end_lat?: number;
  end_lon?: number;
}

export interface EndRentalResponse {
  rental: Rental;
  payment: PaymentResult;
}

export function endRental(rentalId: string, payload: EndRentalPayload = {}): Promise<EndRentalResponse> {
  return request<EndRentalResponse>(`/api/rentals/${rentalId}/end`, {
    method: 'PUT',
    body: payload,
  });
}

export function getRental(rentalId: string): Promise<Rental> {
  return request<Rental>(`/api/rentals/${rentalId}`);
}
