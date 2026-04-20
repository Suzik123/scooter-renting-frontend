import type { Ride } from '../../types';
import HistoryRideCard from './HistoryRideCard';

interface HistoryRideGroupProps {
  label: string;
  rides: Ride[];
}

export default function HistoryRideGroup({ label, rides }: HistoryRideGroupProps) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">{label}</h3>
      <div className="space-y-3">
        {rides.map((ride) => (
          <HistoryRideCard key={ride.id} ride={ride} />
        ))}
      </div>
    </div>
  );
}
