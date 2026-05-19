import { useTranslation } from 'react-i18next';
import PaymentMethodList from '../components/sections/PaymentMethodList';
import TransactionList from '../components/sections/TransactionList';

export default function WalletPage() {
  const { t } = useTranslation('wallet');
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl">
      <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] mb-6">{t('title')}</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        <PaymentMethodList />
        <TransactionList />
      </div>
    </div>
  );
}
