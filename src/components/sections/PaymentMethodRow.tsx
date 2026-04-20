import { clsx } from 'clsx';
import { CreditCard, Smartphone } from 'lucide-react';
import type { PaymentMethod } from '../../types';
import IconTile from '../ui/IconTile';

interface PaymentMethodRowProps {
  method: PaymentMethod;
  onSelect?: (id: string) => void;
  selectable?: boolean;
}

export default function PaymentMethodRow({ method, onSelect, selectable = false }: PaymentMethodRowProps) {
  const Icon = method.type === 'apple-pay' ? Smartphone : CreditCard;

  const content = (
    <>
      <IconTile tone="slate" size="lg">
        <Icon size={18} className="text-slate-600" />
      </IconTile>
      <div className="flex-1 text-left">
        <p className="text-sm font-medium text-slate-900">{method.label}</p>
        {method.last4 && <p className="text-xs text-slate-500">**** {method.last4}</p>}
      </div>
      {method.isDefault && <span className="text-xs text-primary font-medium">Default</span>}
    </>
  );

  const className = clsx(
    'flex items-center gap-3 p-3 rounded-xl border transition-colors w-full',
    method.isDefault ? 'border-primary bg-primary-light' : 'border-slate-100',
    selectable && 'hover:border-primary cursor-pointer',
  );

  if (selectable && onSelect) {
    return (
      <button type="button" onClick={() => onSelect(method.id)} className={className}>
        {content}
      </button>
    );
  }

  return <div className={className}>{content}</div>;
}
