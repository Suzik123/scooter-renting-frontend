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

export function logout(): Promise<void> {
  return request<void>('/api/auth/logout', { method: 'POST', noRetry: true });
}

export interface PasswordResetRequestPayload {
  email: string;
}

export function requestPasswordReset(payload: PasswordResetRequestPayload): Promise<void> {
  return request<void>('/api/auth/password-reset/request', {
    method: 'POST',
    body: payload,
    auth: false,
    noRetry: true,
  });
}

export interface PasswordResetConfirmPayload {
  token: string;
  new_password: string;
}

export function confirmPasswordReset(payload: PasswordResetConfirmPayload): Promise<void> {
  return request<void>('/api/auth/password-reset/confirm', {
    method: 'POST',
    body: payload,
    auth: false,
    noRetry: true,
  });
}
