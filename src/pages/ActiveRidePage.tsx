import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import RideTimerCard from '../components/sections/RideTimerCard';
import ActiveRideScooterCard from '../components/sections/ActiveRideScooterCard';
import { useActiveRideStore } from '../stores/activeRideStore';
import { useUIStore } from '../stores/uiStore';

export default function ActiveRidePage() {
  const { t } = useTranslation('ride');
  const ride = useActiveRideStore((s) => s.activeRide);
  const endRide = useActiveRideStore((s) => s.endRide);
  const loading = useActiveRideStore((s) => s.loading);
  const error = useActiveRideStore((s) => s.error);
  const showToast = useUIStore((s) => s.showToast);
  const navigate = useNavigate();

  const [hydrated, setHydrated] = useState(() => useActiveRideStore.persist.hasHydrated());
  useEffect(() => useActiveRideStore.persist.onFinishHydration(() => setHydrated(true)), []);

  useEffect(() => {
    if (hydrated && !ride) navigate('/map', { replace: true });
  }, [hydrated, ride, navigate]);

  if (!hydrated) return null;
  if (!ride) return null;

  const handleEndRide = async () => {
    const result = await endRide();
    if (result) {
      showToast(t('active.endedToast'), 'success');
      navigate('/ride/complete');
    } else {
      showToast(error ?? t('active.endFailedToast'), 'error');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-xl mx-auto">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Badge variant="success" className="animate-pulse text-sm px-4 py-1.5">
            {t('active.badge')}
          </Badge>
          <span className="text-xs text-[var(--color-text-muted)]">{t('active.scooterPrefix', { id: ride.scooter_id })}</span>
        </div>

        <RideTimerCard />
        <ActiveRideScooterCard />

        <Button
          variant="danger"
          fullWidth
          size="lg"
          className="text-base"
          onClick={handleEndRide}
          disabled={loading}
        >
          {loading ? t('active.ending') : t('active.endRide')}
        </Button>
      </div>
    </div>
  );
}
