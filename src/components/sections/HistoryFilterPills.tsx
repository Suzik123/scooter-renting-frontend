import FilterPills from '../ui/FilterPills';
import { useRideHistoryStore, type HistoryFilter } from '../../stores/rideHistoryStore';

const OPTIONS: readonly HistoryFilter[] = ['All', 'This Week', 'Last Week', 'This Month'] as const;

interface HistoryFilterPillsProps {
  className?: string;
}

export default function HistoryFilterPills({ className }: HistoryFilterPillsProps) {
  const filter = useRideHistoryStore((s) => s.filter);
  const setFilter = useRideHistoryStore((s) => s.setFilter);

  return (
    <FilterPills
      options={OPTIONS}
      value={filter}
      onChange={setFilter}
      ariaLabel="Ride filter"
      className={className}
    />
  );
}
