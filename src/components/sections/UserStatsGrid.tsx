import { Bike, Clock, DollarSign, Leaf } from 'lucide-react';
import StatCard from '../ui/StatCard';
import {
  useRideHistoryStore,
  rentalDurationSeconds,
} from '../../stores/rideHistoryStore';
import { toNum } from '../../lib/decimal';

const CO2_PER_KM_KG = 0.21;

function formatTotalTime(seconds: number): string {
  const hours = seconds / 3600;
  if (hours >= 1) return `${hours.toFixed(1)}h`;
  const mins = Math.round(seconds / 60);
  return `${mins}m`;
}

export default function UserStatsGrid() {
  const rides = useRideHistoryStore((s) => s.rides);

  const totalSeconds = rides.reduce((sum, r) => sum + rentalDurationSeconds(r), 0);
  const totalDistanceM = rides.reduce((sum, r) => sum + (r.distance_m ?? 0), 0);
  const totalSpent = rides.reduce((sum, r) => sum + toNum(r.total_cost), 0);
  const co2Saved = (totalDistanceM / 1000) * CO2_PER_KM_KG;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <StatCard icon={<Bike size={18} />} label="Total Rides" value={String(rides.length)} />
      <StatCard icon={<Clock size={18} />} label="Time Riding" value={formatTotalTime(totalSeconds)} />
      <StatCard icon={<DollarSign size={18} />} label="Total Spent" value={`$${totalSpent.toFixed(2)}`} />
      <StatCard icon={<Leaf size={18} />} label="CO2 Saved" value={`${co2Saved.toFixed(1)} kg`} />
    </div>
  );
}
