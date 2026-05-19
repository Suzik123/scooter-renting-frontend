import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Rental } from '../../types';
import Badge from '../ui/Badge';
import {
  rentalDurationSeconds,
  formatDurationLabel,
  formatDistance,
  formatCost,
  rentalDateLabel,
} from '../../stores/rideHistoryStore';

interface HistoryRideRowProps {
  ride: Rental;
}

export default function HistoryRideRow({ ride }: HistoryRideRowProps) {
  const { t } = useTranslation(['history', 'common']);
  const duration = formatDurationLabel(rentalDurationSeconds(ride));
  const statusLabel = t(`common:status.${ride.status}`, {
    defaultValue: ride.status,
  });

  return (
    <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
      <td className="px-4 py-3">
        <p className="text-sm font-medium text-slate-900">{t('history:ride.ridePrefix', { id: ride.rental_id.slice(0, 8) })}</p>
      </td>
      <td className="px-4 py-3">
        <p className="text-sm text-slate-600">{ride.scooter_id}</p>
      </td>
      <td className="px-4 py-3 text-sm text-slate-600">{rentalDateLabel(ride)}</td>
      <td className="px-4 py-3 text-sm text-slate-600">{duration}</td>
      <td className="px-4 py-3 text-sm text-slate-600">{formatDistance(ride.distance_m)}</td>
      <td className="px-4 py-3 text-sm font-semibold text-slate-900">{formatCost(ride.total_cost)}</td>
      <td className="px-4 py-3">
        <Badge variant={ride.status === 'completed' ? 'success' : 'default'}>
          {statusLabel}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <Link
          to={`/history/${ride.rental_id}`}
          className="text-primary hover:underline"
          aria-label={t('history:table.viewRideAria', { id: ride.rental_id })}
        >
          <ChevronRight size={16} />
        </Link>
      </td>
    </tr>
  );
}
