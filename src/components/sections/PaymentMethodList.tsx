import { useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PaymentMethodRow from './PaymentMethodRow';
import SectionHeader from '../ui/SectionHeader';
import { usePaymentMethodsStore } from '../../stores/paymentMethodsStore';
import { useUIStore } from '../../stores/uiStore';

export default function PaymentMethodList() {
  const { t } = useTranslation('wallet');
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
        title={t('methods.title')}
        className="mb-4"
        action={
          <button
            type="button"
            onClick={openAddCard}
            className="text-sm text-primary font-medium cursor-pointer hover:underline inline-flex items-center gap-1"
          >
            <Plus size={14} /> {t('methods.add')}
          </button>
        }
      />
      {error && (
        <p className="text-sm text-red-600 mb-3" role="alert">
          {error}
        </p>
      )}
      {loading && methods.length === 0 ? (
        <p className="text-sm text-slate-500">{t('methods.loading')}</p>
      ) : methods.length === 0 ? (
        <p className="text-sm text-slate-500">
          {t('methods.empty')}
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
