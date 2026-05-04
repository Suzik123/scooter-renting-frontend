import { useEffect } from 'react';
import { Plus } from 'lucide-react';
import PaymentMethodRow from './PaymentMethodRow';
import SectionHeader from '../ui/SectionHeader';
import { usePaymentMethodsStore } from '../../stores/paymentMethodsStore';
import { useUIStore } from '../../stores/uiStore';

export default function PaymentMethodList() {
  const methods = usePaymentMethodsStore((s) => s.methods);
  const loading = usePaymentMethodsStore((s) => s.loading);
  const error = usePaymentMethodsStore((s) => s.error);
  const loaded = usePaymentMethodsStore((s) => s.loaded);
  const load = usePaymentMethodsStore((s) => s.load);
  const remove = usePaymentMethodsStore((s) => s.remove);
  const openAddCard = useUIStore((s) => s.openAddCard);

  useEffect(() => {
    if (!loaded) load();
  }, [loaded, load]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
      <SectionHeader
        title="Payment Methods"
        className="mb-4"
        action={
          <button
            type="button"
            onClick={openAddCard}
            className="text-sm text-primary font-medium cursor-pointer hover:underline inline-flex items-center gap-1"
          >
            <Plus size={14} /> Add
          </button>
        }
      />
      {error && (
        <p className="text-sm text-red-600 mb-3" role="alert">
          {error}
        </p>
      )}
      {loading && methods.length === 0 ? (
        <p className="text-sm text-slate-500">Loading...</p>
      ) : methods.length === 0 ? (
        <p className="text-sm text-slate-500">
          No saved cards yet. Add a card to start riding.
        </p>
      ) : (
        <div className="space-y-3">
          {methods.map((method) => (
            <PaymentMethodRow key={method.id} method={method} onRemove={remove} />
          ))}
        </div>
      )}
    </div>
  );
}
