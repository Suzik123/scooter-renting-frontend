import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import TransactionRow from './TransactionRow';
import SectionHeader from '../ui/SectionHeader';
import { usePaymentsHistoryStore } from '../../stores/paymentsHistoryStore';
import { useAuthStore } from '../../stores/authStore';

export default function TransactionList() {
  const { t } = useTranslation('wallet');
  const items = usePaymentsHistoryStore((s) => s.items);
  const loading = usePaymentsHistoryStore((s) => s.loading);
  const error = usePaymentsHistoryStore((s) => s.error);
  const load = usePaymentsHistoryStore((s) => s.load);
  const userId = useAuthStore((s) => s.user?.user_id ?? null);

  useEffect(() => {
    if (userId) load(userId, { limit: 5 });
  }, [userId, load]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
      <SectionHeader title={t('transactions.title')} className="mb-4" />
      {error && (
        <p className="text-sm text-red-600 mb-3" role="alert">
          {error}
        </p>
      )}
      {loading && items.length === 0 ? (
        <p className="text-sm text-slate-500">{t('transactions.loading')}</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-slate-500">{t('transactions.empty')}</p>
      ) : (
        <div className="space-y-3">
          {items.slice(0, 5).map((p) => (
            <TransactionRow key={p.payment_id} payment={p} />
          ))}
        </div>
      )}
    </div>
  );
}
