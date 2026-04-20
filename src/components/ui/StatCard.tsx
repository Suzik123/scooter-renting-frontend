import { clsx } from 'clsx';
import type { ReactNode } from 'react';

interface StatCardProps {
  icon?: ReactNode;
  label: string;
  value: string;
  className?: string;
}

export default function StatCard({ icon, label, value, className }: StatCardProps) {
  return (
    <div className={clsx('bg-white rounded-xl shadow-sm border border-slate-100 p-4', className)}>
      {icon && <div className="text-primary mb-2">{icon}</div>}
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}
