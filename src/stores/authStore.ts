import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import { currentUser as mockUser } from '../mock/data';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      login: async (email, _password) => {
        set({ loading: true, error: null });
        try {
          const user: User = { ...mockUser, email: email || mockUser.email };
          set({ user, isAuthenticated: true, loading: false });
        } catch (e) {
          set({ loading: false, error: 'Login failed' });
        }
      },
      register: async (name, email, _password) => {
        set({ loading: true, error: null });
        try {
          const first = name.trim().split(' ')[0] || 'U';
          const last = name.trim().split(' ')[1] || '';
          const initials = ((first[0] || 'U') + (last[0] || '')).toUpperCase();
          const user: User = { ...mockUser, name: name || mockUser.name, email: email || mockUser.email, initials };
          set({ user, isAuthenticated: true, loading: false });
        } catch (e) {
          set({ loading: false, error: 'Registration failed' });
        }
      },
      logout: () => set({ user: null, isAuthenticated: false, error: null }),
    }),
    { name: 'uniscoot-auth' },
  ),
);
