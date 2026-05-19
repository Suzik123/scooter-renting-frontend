import { useTranslation } from 'react-i18next';
import type { Rental } from '../../types';
import HistoryRideCard from './HistoryRideCard';

interface HistoryRideGroupProps {
  label: string;
  rides: Rental[];
}

export default function HistoryRideGroup({ label, rides }: HistoryRideGroupProps) {
  const { t } = useTranslation('history');
  const translated = t(`groups.${label}`, { defaultValue: label });
  return (
    <div>
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">{translated}</h3>
      <div className="space-y-3">
        {rides.map((ride) => (
          <HistoryRideCard key={ride.rental_id} ride={ride} />
        ))}
      </div>
    </div>
  );
}
