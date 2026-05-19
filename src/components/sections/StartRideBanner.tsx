import { Link } from 'react-router-dom';
import { Bike, PlayCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAvailableScooters } from '../../stores/scootersStore';
import { useActiveRideStore } from '../../stores/activeRideStore';

export default function StartRideBanner() {
  const { t } = useTranslation('dashboard');
  const available = useAvailableScooters();
  const activeRide = useActiveRideStore((s) => s.activeRide);

  if (activeRide) {
    return (
      <Link
        to="/ride/active"
        className="block bg-gradient-to-r from-primary to-emerald-600 rounded-2xl p-5 sm:p-6 mb-6 text-white hover:shadow-lg transition-shadow"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/80 mb-1">{t('startRide.rideInProgress')}</p>
            <h2 className="text-lg sm:text-xl font-bold mb-1">{t('startRide.resume')}</h2>
            <p className="text-sm text-white/80">{activeRide.scooter_label} · {activeRide.scooter_id}</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <PlayCircle size={24} />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to="/map"
      className="block bg-gradient-to-r from-primary to-emerald-600 rounded-2xl p-5 sm:p-6 mb-6 text-white hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/80 mb-1">{t('startRide.ready')}</p>
          <h2 className="text-lg sm:text-xl font-bold mb-1">{t('startRide.startTitle')}</h2>
          <p className="text-sm text-white/80">{t('startRide.scootersNearby', { count: available.length })}</p>
        </div>
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <Bike size={24} />
        </div>
      </div>
    </Link>
  );
}
