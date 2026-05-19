import { useTranslation } from 'react-i18next';
import FilterPills from '../ui/FilterPills';
import { useRideHistoryStore, type HistoryFilter } from '../../stores/rideHistoryStore';

const OPTIONS: readonly HistoryFilter[] = ['All', 'This Week', 'Last Week', 'This Month'] as const;

const LABEL_KEY: Record<HistoryFilter, string> = {
  'All': 'filters.all',
  'This Week': 'filters.thisWeek',
  'Last Week': 'filters.lastWeek',
  'This Month': 'filters.thisMonth',
};

interface HistoryFilterPillsProps {
  className?: string;
}

export default function HistoryFilterPills({ className }: HistoryFilterPillsProps) {
  const { t } = useTranslation('history');
  const filter = useRideHistoryStore((s) => s.filter);
  const setFilter = useRideHistoryStore((s) => s.setFilter);

  return (
    <FilterPills
      options={OPTIONS}
      value={filter}
      onChange={setFilter}
      ariaLabel={t('filters.ariaLabel')}
      labelFor={(opt) => t(LABEL_KEY[opt])}
      className={className}
    />
  );
}
