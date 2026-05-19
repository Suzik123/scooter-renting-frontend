import { Leaf } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ProgressBar from '../ui/ProgressBar';
import { useRideHistoryStore } from '../../stores/rideHistoryStore';

const CO2_PER_KM_KG = 0.21;

export default function ProfileEcoImpact() {
  const { t } = useTranslation('profile');
  const rides = useRideHistoryStore((s) => s.rides);
  const totalDistanceKm =
    rides.reduce((sum, r) => sum + (r.distance_m ?? 0), 0) / 1000;
  const co2Saved = totalDistanceKm * CO2_PER_KM_KG;
  const greenRides = rides.length;
  const greenTarget = 50;
  const greenPct = Math.min(100, Math.round((greenRides / greenTarget) * 100));
  const co2Pct = Math.min(100, Math.round((co2Saved / 50) * 100));

  return (
    <div className="hidden lg:block mt-6 bg-gradient-to-br from-primary-light to-white rounded-xl border border-green-200 p-5">
      <div className="flex items-center gap-2 mb-3">
        <Leaf size={18} className="text-primary" />
        <h3 className="font-semibold text-slate-900">{t('ecoImpact.title')}</h3>
      </div>
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-slate-600">{t('ecoImpact.co2Saved')}</span>
            <span className="font-semibold text-slate-900">{co2Saved.toFixed(1)} kg</span>
          </div>
          <ProgressBar value={co2Pct} track="green" height="md" />
        </div>
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-slate-600">{t('ecoImpact.greenRides')}</span>
            <span className="font-semibold text-slate-900">{greenRides} / {greenTarget}</span>
          </div>
          <ProgressBar value={greenPct} track="green" height="md" />
        </div>
      </div>
    </div>
  );
}
