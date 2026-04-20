import { clsx } from 'clsx';
import { useScootersStore, type ScooterFilter } from '../../stores/scootersStore';

const FILTERS: ScooterFilter[] = ['All', 'Nearest', 'Best Battery', 'Cheapest'];

export default function MapFilterPills() {
  const filter = useScootersStore((s) => s.filter);
  const setFilter = useScootersStore((s) => s.setFilter);

  return (
    <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide" role="tablist" aria-label="Scooter filter">
      {FILTERS.map((f) => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          role="tab"
          aria-selected={filter === f}
          className={clsx(
            'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer',
            filter === f ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
          )}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
