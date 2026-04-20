import type { ReactNode } from 'react';
import { clsx } from 'clsx';

interface SectionHeaderProps {
  title: string;
  action?: ReactNode;
  className?: string;
  titleClassName?: string;
}

export default function SectionHeader({ title, action, className, titleClassName }: SectionHeaderProps) {
  return (
    <div className={clsx('flex items-center justify-between', className)}>
      <h3 className={clsx('font-semibold text-slate-900', titleClassName)}>{title}</h3>
      {action}
    </div>
  );
}
