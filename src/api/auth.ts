import { request } from './client';
import type { User } from '../types';

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterPayload {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  phone_number?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export function login(payload: LoginPayload): Promise<AuthResponse> {
  return request<AuthResponse>('/api/auth/login', { method: 'POST', body: payload, auth: false });
}

export function register(payload: RegisterPayload): Promise<AuthResponse> {
  return request<AuthResponse>('/api/auth/register', { method: 'POST', body: payload, auth: false });
}

export function oauthGoogle(idToken: string): Promise<AuthResponse> {
  return request<AuthResponse>('/api/auth/oauth/google', {
    method: 'POST',
    body: { id_token: idToken },
    auth: false,
  });
}
