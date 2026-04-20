import { useWalletStore } from '../../stores/walletStore';
import TransactionRow from './TransactionRow';
import SectionHeader from '../ui/SectionHeader';

export default function TransactionList() {
  const transactions = useWalletStore((s) => s.transactions);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
      <SectionHeader
        title="Recent Transactions"
        className="mb-4"
        action={
          <button className="text-sm text-primary font-medium cursor-pointer hover:underline">See All</button>
        }
      />
      <div className="space-y-3">
        {transactions.slice(0, 5).map((tx) => (
          <TransactionRow key={tx.id} tx={tx} />
        ))}
      </div>
    </div>
  );
}
