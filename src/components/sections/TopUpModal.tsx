import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import Button from '../ui/Button';
import PaymentMethodRow from './PaymentMethodRow';
import { useWalletStore } from '../../stores/walletStore';
import { useUIStore } from '../../stores/uiStore';

const PRESETS = [10, 25, 50, 100];

export default function TopUpModal() {
  const open = useUIStore((s) => s.topUpModalOpen);
  const closeTopUp = useUIStore((s) => s.closeTopUp);
  const showToast = useUIStore((s) => s.showToast);
  const methods = useWalletStore((s) => s.paymentMethods);
  const topUp = useWalletStore((s) => s.topUp);
  const loading = useWalletStore((s) => s.loading);

  const [amount, setAmount] = useState<number>(25);
  const [methodId, setMethodId] = useState<string>('');

  useEffect(() => {
    if (open) {
      setAmount(25);
      setMethodId(methods.find((m) => m.isDefault)?.id ?? methods[0]?.id ?? '');
    }
  }, [open, methods]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeTopUp();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, closeTopUp]);

  if (!open) return null;

  const handleConfirm = async () => {
    if (!methodId || amount <= 0) return;
    await topUp(amount, methodId);
    showToast(`Added $${amount.toFixed(2)} to your wallet`, 'success');
    closeTopUp();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="topup-title"
      onClick={closeTopUp}
    >
      <div
        className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 id="topup-title" className="text-lg font-bold text-slate-900">Top Up Wallet</h2>
          <button
            onClick={closeTopUp}
            className="text-slate-400 hover:text-slate-600 cursor-pointer"
            aria-label="Close top up"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Amount</label>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setAmount(p)}
                  className={`py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    amount === p
                      ? 'bg-primary text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  ${p}
                </button>
              ))}
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
              <input
                type="number"
                min={1}
                step="1"
                value={amount}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  setAmount(Number.isFinite(n) ? n : 0);
                }}
                className="w-full pl-7 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Custom amount"
              />
            </div>
          </div>

          <div>
            <p className="block text-sm font-medium text-slate-700 mb-2">Payment Method</p>
            <div className="space-y-2">
              {methods.map((m) => (
                <PaymentMethodRow
                  key={m.id}
                  method={{ ...m, isDefault: m.id === methodId }}
                  selectable
                  onSelect={setMethodId}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-slate-100 flex gap-3">
          <Button variant="outline" fullWidth onClick={closeTopUp} disabled={loading}>
            Cancel
          </Button>
          <Button fullWidth onClick={handleConfirm} disabled={loading || !Number.isFinite(amount) || amount <= 0 || !methodId}>
            {loading ? 'Processing...' : `Add $${amount.toFixed(2)}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
