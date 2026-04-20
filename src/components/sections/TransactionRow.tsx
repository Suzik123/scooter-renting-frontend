import { clsx } from 'clsx';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import type { Transaction } from '../../types';

interface TransactionRowProps {
  tx: Transaction;
}

export default function TransactionRow({ tx }: TransactionRowProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={clsx(
          'w-9 h-9 rounded-full flex items-center justify-center',
          tx.positive ? 'bg-green-100' : 'bg-red-50',
        )}
      >
        {tx.positive ? (
          <ArrowDownLeft size={16} className="text-green-600" />
        ) : (
          <ArrowUpRight size={16} className="text-red-500" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 truncate">{tx.description}</p>
        <p className="text-xs text-slate-500">{tx.date}</p>
      </div>
      <span
        className={clsx(
          'text-sm font-semibold',
          tx.positive ? 'text-green-600' : 'text-slate-900',
        )}
      >
        {tx.amount}
      </span>
    </div>
  );
}
