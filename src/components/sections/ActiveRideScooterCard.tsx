import { MapPin, Clock } from 'lucide-react';
import { useActiveRideStore } from '../../stores/activeRideStore';
import ProgressBar from '../ui/ProgressBar';
import IconTile from '../ui/IconTile';

export default function ActiveRideScooterCard() {
  const ride = useActiveRideStore((s) => s.activeRide);
  const elapsed = useActiveRideStore((s) => s.elapsedSeconds);

  if (!ride) return null;

  const distanceKm = Math.max(0.1, (elapsed / 60) * 0.18);
  const etaMin = Math.max(1, Math.round(5 - elapsed / 60));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-900">{ride.scooterName}</h3>
          <p className="text-xs text-slate-500">{ride.scooterId}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-900">{ride.battery}%</p>
          <p className="text-xs text-slate-500">Battery</p>
        </div>
      </div>
      <ProgressBar value={ride.battery} height="md" className="mb-4" />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <IconTile tone="blue">
            <MapPin size={18} className="text-blue-500" />
          </IconTile>
          <div>
            <p className="text-xs text-slate-500">Distance</p>
            <p className="text-sm font-semibold text-slate-900">{distanceKm.toFixed(1)} km</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <IconTile tone="purple">
            <Clock size={18} className="text-purple-500" />
          </IconTile>
          <div>
            <p className="text-xs text-slate-500">ETA</p>
            <p className="text-sm font-semibold text-slate-900">~{etaMin} min</p>
          </div>
        </div>
      </div>
    </div>
  );
}
