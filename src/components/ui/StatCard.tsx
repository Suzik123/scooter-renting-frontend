import { clsx } from 'clsx';
import type { ReactNode } from 'react';

interface StatCardProps {
  icon?: ReactNode;
  label: string;
  value: string;
  align?: 'left' | 'center';
  size?: 'sm' | 'md';
  className?: string;
}

export default function StatCard({
  icon,
  label,
  value,
  align = 'left',
  size = 'md',
  className,
}: StatCardProps) {
  const padding = size === 'sm' ? 'p-3' : 'p-4';
  const valueClass = size === 'sm' ? 'text-sm' : 'text-lg';

  return (
    <div
      className={clsx(
        'bg-white rounded-xl shadow-sm border border-slate-100',
        padding,
        align === 'center' && 'text-center',
        className,
      )}
    >
      {icon && (
        <div
          className={clsx(
            'text-primary',
            align === 'center' ? 'mx-auto mb-1 flex justify-center' : 'mb-2',
          )}
        >
          {icon}
        </div>
      )}
      <p className={clsx('text-xs text-slate-500', size === 'sm' ? 'mb-0.5' : 'mb-1')}>{label}</p>
      <p className={clsx('font-semibold text-slate-900', valueClass)}>{value}</p>
    </div>
  );
}
