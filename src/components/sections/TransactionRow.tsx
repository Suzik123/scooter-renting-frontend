import { clsx } from 'clsx';
import { ArrowUpRight, AlertCircle, Clock, RotateCcw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Payment } from '../../types';
import { toNum, type DecimalLike } from '../../lib/decimal';

interface TransactionRowProps {
  payment: Payment;
}

function formatAmount(amount: DecimalLike, currency: string, locale: string): string {
  const n = toNum(amount);
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(n);
  } catch {
    return `${n.toFixed(2)} ${currency}`;
  }
}

function formatDate(iso: string, locale: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function TransactionRow({ payment }: TransactionRowProps) {
  const { t, i18n } = useTranslation('wallet');
  const locale = i18n.resolvedLanguage === 'pl' ? 'pl-PL' : 'en-US';
  const failed = payment.status === 'failed';
  const pending = payment.status === 'pending';
  const refunded = payment.status === 'refunded';

  const description = payment.rental_id
    ? t('transactions.ridePrefix', {
        id: payment.rental_id.length > 8 ? payment.rental_id.slice(0, 8) : payment.rental_id,
      })
    : t('transactions.payment');

  return (
    <div className="flex items-center gap-3">
      <div
        className={clsx(
          'w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0',
          failed
            ? 'bg-red-50'
            : pending
              ? 'bg-amber-50'
              : refunded
                ? 'bg-blue-50'
                : 'bg-slate-100',
        )}
      >
        {failed ? (
          <AlertCircle size={16} className="text-red-500" />
        ) : pending ? (
          <Clock size={16} className="text-amber-500" />
        ) : refunded ? (
          <RotateCcw size={16} className="text-blue-500" />
        ) : (
          <ArrowUpRight size={16} className="text-slate-500" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 truncate">{description}</p>
        <p className="text-xs text-slate-500">
          {formatDate(payment.transaction_date, locale)}
          {failed && payment.failure_reason ? ` · ${payment.failure_reason}` : ''}
          {pending ? ` · ${t('transactions.pendingSuffix')}` : ''}
          {refunded ? ` · ${t('transactions.refundedSuffix')}` : ''}
        </p>
      </div>
      <span
        className={clsx(
          'text-sm font-semibold',
          failed ? 'text-red-600' : refunded ? 'text-blue-600' : 'text-slate-900',
        )}
      >
        {formatAmount(payment.amount, payment.currency, locale)}
      </span>
    </div>
  );
}
