import FilterPills from '../ui/FilterPills';
import { useScootersStore, type ScooterFilter } from '../../stores/scootersStore';

const FILTERS: readonly ScooterFilter[] = ['All', 'Nearest', 'Best Battery', 'Cheapest'] as const;

export default function MapFilterPills() {
  const filter = useScootersStore((s) => s.filter);
  const setFilter = useScootersStore((s) => s.setFilter);

  return (
    <FilterPills
      options={FILTERS}
      value={filter}
      onChange={setFilter}
      ariaLabel="Scooter filter"
      className="mt-3"
    />
  );
}
