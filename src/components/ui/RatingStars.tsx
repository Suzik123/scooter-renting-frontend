import { Star } from 'lucide-react';
import { clsx } from 'clsx';

interface RatingStarsProps {
  value: number;
  readonly?: boolean;
  size?: number;
  onChange?: (value: number) => void;
  className?: string;
}

export default function RatingStars({ value, readonly = true, size = 16, onChange, className }: RatingStarsProps) {
  return (
    <div className={clsx('flex gap-0.5', className)} role={readonly ? undefined : 'radiogroup'}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < value;
        if (readonly) {
          return (
            <Star
              key={i}
              size={size}
              className={filled ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}
            />
          );
        }
        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange?.(i + 1)}
            className="cursor-pointer p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            aria-label={`Rate ${i + 1} stars`}
            aria-checked={filled}
            role="radio"
          >
            <Star size={size} className={filled ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'} />
          </button>
        );
      })}
    </div>
  );
}
