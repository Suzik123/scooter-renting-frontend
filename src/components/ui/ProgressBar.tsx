import { clsx } from 'clsx';

interface ProgressBarProps {
  value: number;
  color?: 'green' | 'yellow' | 'red';
  height?: 'xs' | 'sm' | 'md';
  track?: 'slate' | 'green';
  className?: string;
}

export default function ProgressBar({
  value,
  color = 'green',
  height = 'sm',
  track = 'slate',
  className,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className={clsx(
        'w-full rounded-full',
        track === 'green' ? 'bg-green-200' : 'bg-slate-100',
        height === 'xs' && 'h-1',
        height === 'sm' && 'h-1.5',
        height === 'md' && 'h-2',
        className,
      )}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={clsx(
          'rounded-full',
          height === 'xs' && 'h-1',
          height === 'sm' && 'h-1.5',
          height === 'md' && 'h-2',
          color === 'green' && 'bg-primary',
          color === 'yellow' && 'bg-yellow-400',
          color === 'red' && 'bg-red-400',
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export function batteryColor(battery: number): 'green' | 'yellow' | 'red' {
  if (battery > 50) return 'green';
  if (battery > 20) return 'yellow';
  return 'red';
}
