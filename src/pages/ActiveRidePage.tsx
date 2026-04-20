import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import RideTimerCard from '../components/sections/RideTimerCard';
import ActiveRideScooterCard from '../components/sections/ActiveRideScooterCard';
import RideMapCard from '../components/sections/RideMapCard';
import { useActiveRideStore } from '../stores/activeRideStore';
import { useUIStore } from '../stores/uiStore';

export default function ActiveRidePage() {
  const ride = useActiveRideStore((s) => s.activeRide);
  const endRide = useActiveRideStore((s) => s.endRide);
  const loading = useActiveRideStore((s) => s.loading);
  const showToast = useUIStore((s) => s.showToast);
  const navigate = useNavigate();

  // Wait for persist rehydration before deciding to redirect — otherwise the
  // first render sees null and bounces the user off a valid deep-linked ride.
  const [hydrated, setHydrated] = useState(() => useActiveRideStore.persist.hasHydrated());
  useEffect(() => useActiveRideStore.persist.onFinishHydration(() => setHydrated(true)), []);

  useEffect(() => {
    if (hydrated && !ride) navigate('/map', { replace: true });
  }, [hydrated, ride, navigate]);

  if (!hydrated) return null;
  if (!ride) return null;

  const handleEndRide = async () => {
    const finished = await endRide();
    if (finished) {
      showToast(`Ride ended. ${finished.cost} charged`, 'success');
      navigate('/ride/complete');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Badge variant="success" className="animate-pulse text-sm px-4 py-1.5">
              RIDE ACTIVE
            </Badge>
            <span className="text-xs text-slate-500">Scooter {ride.scooterId}</span>
          </div>

          <RideTimerCard />
          <ActiveRideScooterCard />

          <Button variant="danger" fullWidth size="lg" className="text-base" onClick={handleEndRide} disabled={loading}>
            {loading ? 'Ending...' : 'End Ride'}
          </Button>
        </div>

        <RideMapCard variant="active" />
      </div>
    </div>
  );
}
