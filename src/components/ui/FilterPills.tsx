import { clsx } from 'clsx';

interface FilterPillsProps<T extends string> {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  className?: string;
}

export default function FilterPills<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  className,
}: FilterPillsProps<T>) {
  return (
    <div
      className={clsx('flex gap-2 overflow-x-auto scrollbar-hide', className)}
      role="tablist"
      aria-label={ariaLabel}
    >
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          role="tab"
          aria-selected={value === opt}
          className={clsx(
            'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer',
            value === opt ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
