import { create } from 'zustand';

export type ToastKind = 'success' | 'info' | 'error';

export interface Toast {
  id: string;
  message: string;
  kind: ToastKind;
}

interface UIState {
  toasts: Toast[];
  topUpModalOpen: boolean;
  confirmEndRideOpen: boolean;
  showToast: (message: string, kind?: ToastKind) => void;
  dismissToast: (id: string) => void;
  openTopUp: () => void;
  closeTopUp: () => void;
  openConfirmEndRide: () => void;
  closeConfirmEndRide: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  toasts: [],
  topUpModalOpen: false,
  confirmEndRideOpen: false,
  showToast: (message, kind = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    set((s) => ({ toasts: [...s.toasts, { id, message, kind }] }));
    setTimeout(() => {
      if (get().toasts.some((t) => t.id === id)) {
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
      }
    }, 3500);
  },
  dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  openTopUp: () => set({ topUpModalOpen: true }),
  closeTopUp: () => set({ topUpModalOpen: false }),
  openConfirmEndRide: () => set({ confirmEndRideOpen: true }),
  closeConfirmEndRide: () => set({ confirmEndRideOpen: false }),
}));
