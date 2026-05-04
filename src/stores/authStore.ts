import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import * as authApi from '../api/auth';
import { isApiError } from '../api/errors';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string, phoneNumber?: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

function toErrorMessage(e: unknown, fallback: string): string {
  if (isApiError(e)) return e.message || fallback;
  if (e instanceof Error) return e.message || fallback;
  return fallback;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const { token, user } = await authApi.login({ email, password });
          set({ user, token, isAuthenticated: true, loading: false });
        } catch (e) {
          set({ loading: false, error: toErrorMessage(e, 'Login failed') });
          throw e;
        }
      },
      register: async (firstName, lastName, email, password, phoneNumber) => {
        set({ loading: true, error: null });
        try {
          const { token, user } = await authApi.register({
            email,
            first_name: firstName,
            last_name: lastName,
            password,
            phone_number: phoneNumber || undefined,
          });
          set({ user, token, isAuthenticated: true, loading: false });
        } catch (e) {
          set({ loading: false, error: toErrorMessage(e, 'Registration failed') });
          throw e;
        }
      },
      loginWithGoogle: async (idToken) => {
        set({ loading: true, error: null });
        try {
          const { token, user } = await authApi.oauthGoogle(idToken);
          set({ user, token, isAuthenticated: true, loading: false });
        } catch (e) {
          set({ loading: false, error: toErrorMessage(e, 'Google sign-in failed') });
          throw e;
        }
      },
      logout: () =>
        set({ user: null, token: null, isAuthenticated: false, error: null, loading: false }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'uniscoot-auth',
      partialize: (s) => ({ user: s.user, token: s.token, isAuthenticated: s.isAuthenticated }),
    },
  ),
);
