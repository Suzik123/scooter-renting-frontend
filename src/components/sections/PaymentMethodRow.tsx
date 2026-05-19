import { clsx } from 'clsx';
import { CreditCard, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { PaymentMethod } from '../../types';
import IconTile from '../ui/IconTile';

interface PaymentMethodRowProps {
  method: PaymentMethod;
  onRemove?: (id: string) => void;
  onSelect?: (id: string) => void;
  selectable?: boolean;
  removing?: boolean;
}

const BRAND_LABEL: Record<string, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'American Express',
  discover: 'Discover',
  diners: 'Diners Club',
  jcb: 'JCB',
  unionpay: 'UnionPay',
};

function brandLabel(brand: string, fallback: string): string {
  const key = brand?.toLowerCase() ?? '';
  return BRAND_LABEL[key] ?? (brand ? brand.charAt(0).toUpperCase() + brand.slice(1) : fallback);
}

function pad2(n: number): string {
  return n.toString().padStart(2, '0');
}

export default function PaymentMethodRow({
  method,
  onRemove,
  onSelect,
  selectable = false,
  removing = false,
}: PaymentMethodRowProps) {
  const { t } = useTranslation('wallet');
  const label = brandLabel(method.brand, t('methods.fallbackBrand'));
  const expYearShort = method.exp_year > 99 ? method.exp_year % 100 : method.exp_year;

  const content = (
    <>
      <IconTile tone="slate" size="lg">
        <CreditCard size={18} className="text-slate-600" />
      </IconTile>
      <div className="flex-1 text-left min-w-0">
        <p className="text-sm font-medium text-slate-900 truncate">
          {label} <span className="text-slate-500">•••• {method.last4}</span>
        </p>
        <p className="text-xs text-slate-500">
          {t('methods.expPrefix')} {pad2(method.exp_month)}/{pad2(expYearShort)}
        </p>
      </div>
      {method.is_default && <span className="text-xs text-primary font-medium">{t('methods.default')}</span>}
    </>
  );

  const className = clsx(
    'flex items-center gap-3 p-3 rounded-xl border transition-colors w-full',
    method.is_default ? 'border-primary bg-primary-light' : 'border-slate-100',
    selectable && 'hover:border-primary cursor-pointer',
  );

  if (selectable && onSelect) {
    return (
      <button type="button" onClick={() => onSelect(method.id)} className={className}>
        {content}
      </button>
    );
  }

  return (
    <div className={className}>
      {content}
      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(method.id)}
          disabled={removing}
          className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={t('methods.removeAria', { label, last4: method.last4 })}
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
}
