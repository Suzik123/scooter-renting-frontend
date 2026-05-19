import { useTranslation } from 'react-i18next';
import type { Rental } from '../../types';
import { formatCost } from '../../stores/rideHistoryStore';

interface RideDetailCostBreakdownProps {
  ride: Rental;
}

export default function RideDetailCostBreakdown({ ride }: RideDetailCostBreakdownProps) {
  const { t } = useTranslation('history');
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 mb-4">
      <h3 className="font-semibold text-slate-900 mb-4">{t('detail.cost')}</h3>
      <div className="space-y-3">
        <div className="border-t border-slate-100 pt-3 flex justify-between">
          <span className="font-semibold text-slate-900">{t('detail.totalCharged')}</span>
          <span className="font-bold text-slate-900">{formatCost(ride.total_cost)}</span>
        </div>
      </div>
    </div>
  );
}
