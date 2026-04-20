import { useWalletStore } from '../../stores/walletStore';
import TransactionRow from './TransactionRow';

export default function TransactionList() {
  const transactions = useWalletStore((s) => s.transactions);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900">Recent Transactions</h3>
        <button className="text-sm text-primary font-medium cursor-pointer hover:underline">See All</button>
      </div>
      <div className="space-y-3">
        {transactions.slice(0, 5).map((tx) => (
          <TransactionRow key={tx.id} tx={tx} />
        ))}
      </div>
    </div>
  );
}
