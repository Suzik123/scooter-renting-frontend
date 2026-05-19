import { useTranslation } from 'react-i18next';
import FilterPills from '../ui/FilterPills';
import { useScootersStore, type ScooterFilter } from '../../stores/scootersStore';

const FILTERS: readonly ScooterFilter[] = ['All', 'Nearest', 'Best Battery', 'Cheapest'] as const;

export default function MapFilterPills() {
  const { t } = useTranslation('map');
  const filter = useScootersStore((s) => s.filter);
  const setFilter = useScootersStore((s) => s.setFilter);

  const labelFor = (f: ScooterFilter): string => {
    switch (f) {
      case 'All':
        return t('filters.all');
      case 'Nearest':
        return t('filters.nearest');
      case 'Best Battery':
        return t('filters.battery');
      case 'Cheapest':
        return t('filters.cheapest');
    }
  };

  return (
    <FilterPills
      options={FILTERS}
      value={filter}
      onChange={setFilter}
      ariaLabel={t('filters.all')}
      labelFor={labelFor}
      className="mt-3"
    />
  );
}
