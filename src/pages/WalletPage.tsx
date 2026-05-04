import PaymentMethodList from '../components/sections/PaymentMethodList';
import TransactionList from '../components/sections/TransactionList';

export default function WalletPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">Wallet</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        <PaymentMethodList />
        <TransactionList />
      </div>
    </div>
  );
}
