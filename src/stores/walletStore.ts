import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Transaction, PaymentMethod } from '../types';
import { transactions as mockTx, paymentMethods as mockPm } from '../mock/data';

interface WalletState {
  balance: number;
  transactions: Transaction[];
  paymentMethods: PaymentMethod[];
  loading: boolean;
  error: string | null;
  loadWallet: () => Promise<void>;
  topUp: (amount: number, methodId: string) => Promise<void>;
  chargeRide: (amount: number, rideId: string) => Promise<void>;
  setDefaultPayment: (id: string) => void;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      balance: 24.5,
      transactions: mockTx,
      paymentMethods: mockPm,
      loading: false,
      error: null,
      loadWallet: async () => {
        set({ loading: true, error: null });
        set({ loading: false });
      },
      topUp: async (amount, methodId) => {
        set({ loading: true, error: null });
        try {
          const method = get().paymentMethods.find((m) => m.id === methodId);
          const label = method ? `Top-up - ${method.label}` : 'Balance Top-Up';
          const tx: Transaction = {
            id: `t-${Date.now()}`,
            type: 'topup',
            description: label,
            amount: `+$${amount.toFixed(2)}`,
            date: formatDate(new Date()),
            positive: true,
          };
          set((s) => ({
            balance: s.balance + amount,
            transactions: [tx, ...s.transactions],
            loading: false,
          }));
        } catch (e) {
          set({ loading: false, error: 'Top-up failed' });
        }
      },
      chargeRide: async (amount, rideId) => {
        set({ loading: true, error: null });
        try {
          const tx: Transaction = {
            id: `t-${Date.now()}`,
            type: 'ride',
            description: `Ride - ${rideId}`,
            amount: `-$${amount.toFixed(2)}`,
            date: formatDate(new Date()),
            positive: false,
          };
          set((s) => ({
            balance: Math.max(0, s.balance - amount),
            transactions: [tx, ...s.transactions],
            loading: false,
          }));
        } catch (e) {
          set({ loading: false, error: 'Charge failed' });
        }
      },
      setDefaultPayment: (id) =>
        set((s) => ({
          paymentMethods: s.paymentMethods.map((m) => ({ ...m, isDefault: m.id === id })),
        })),
    }),
    { name: 'uniscoot-wallet' },
  ),
);
