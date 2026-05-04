import { create } from 'zustand';

export type ToastKind = 'success' | 'info' | 'error';

export interface Toast {
  id: string;
  message: string;
  kind: ToastKind;
}

interface UIState {
  toasts: Toast[];
  confirmEndRideOpen: boolean;
  addCardModalOpen: boolean;
  showToast: (message: string, kind?: ToastKind) => void;
  dismissToast: (id: string) => void;
  openConfirmEndRide: () => void;
  closeConfirmEndRide: () => void;
  openAddCard: () => void;
  closeAddCard: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  toasts: [],
  confirmEndRideOpen: false,
  addCardModalOpen: false,
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
  openConfirmEndRide: () => set({ confirmEndRideOpen: true }),
  closeConfirmEndRide: () => set({ confirmEndRideOpen: false }),
  openAddCard: () => set({ addCardModalOpen: true }),
  closeAddCard: () => set({ addCardModalOpen: false }),
}));
