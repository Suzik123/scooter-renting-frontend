import { Bike } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRideHistoryStore } from '../../stores/rideHistoryStore';

export default function ProfileFavoriteScooter() {
  const { t } = useTranslation('profile');
  const rides = useRideHistoryStore((s) => s.rides);
  const counts = new Map<string, number>();
  for (const r of rides) {
    counts.set(r.scooter_id, (counts.get(r.scooter_id) ?? 0) + 1);
  }
  let topId: string | null = null;
  let topCount = 0;
  for (const [id, c] of counts) {
    if (c > topCount) {
      topCount = c;
      topId = id;
    }
  }
  const label = topId ? topId : t('favorite.empty');

  return (
    <div className="lg:hidden bg-white rounded-xl shadow-sm border border-slate-100 p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center">
          <Bike size={20} className="text-primary" />
        </div>
        <div>
          <p className="text-xs text-slate-500">{t('favorite.title')}</p>
          <p className="font-semibold text-sm text-slate-900">{label}</p>
        </div>
      </div>
    </div>
  );
}
