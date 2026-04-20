import { clsx } from 'clsx';
import type { ReactNode } from 'react';

interface IconTileProps {
  children: ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  rounded?: 'lg' | 'full';
  tone?: 'slate' | 'primary' | 'blue' | 'purple' | 'green' | 'red';
}

export default function IconTile({
  children,
  className,
  size = 'md',
  rounded = 'lg',
  tone = 'slate',
}: IconTileProps) {
  return (
    <div
      className={clsx(
        'flex items-center justify-center flex-shrink-0',
        rounded === 'full' ? 'rounded-full' : 'rounded-lg',
        size === 'sm' && 'w-8 h-8',
        size === 'md' && 'w-9 h-9',
        size === 'lg' && 'w-10 h-10',
        tone === 'slate' && 'bg-slate-100',
        tone === 'primary' && 'bg-primary-light',
        tone === 'blue' && 'bg-blue-50',
        tone === 'purple' && 'bg-purple-50',
        tone === 'green' && 'bg-green-100',
        tone === 'red' && 'bg-red-50',
        className,
      )}
    >
      {children}
    </div>
  );
}
