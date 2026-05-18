import { useActiveRideStore } from '../../stores/activeRideStore';
import ProgressBar from '../ui/ProgressBar';

// Distance/ETA were removed: the user never selects a destination, so any value
// shown there was guessed and confusing. Re-introduce only once live telemetry
// lands on the backend.
export default function ActiveRideScooterCard() {
  const ride = useActiveRideStore((s) => s.activeRide);

  if (!ride) return null;

  return (
    <div className="bg-[var(--color-surface)] rounded-xl shadow-sm border border-[var(--color-border-muted)] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-[var(--color-text-primary)]">{ride.scooter_label}</h3>
          <p className="text-xs text-[var(--color-text-muted)]">{ride.scooter_id}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-[var(--color-text-primary)]">{ride.battery_level}%</p>
          <p className="text-xs text-[var(--color-text-muted)]">Battery</p>
        </div>
      </div>
      <ProgressBar value={ride.battery_level} height="md" />
    </div>
  );
}
