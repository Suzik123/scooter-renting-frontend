import { Bike, Clock, DollarSign, Leaf } from 'lucide-react';
import StatCard from '../ui/StatCard';
import { useRideHistoryStore, useTotalRideTime } from '../../stores/rideHistoryStore';

export default function UserStatsGrid() {
  const stats = useRideHistoryStore((s) => s.stats);
  const timeRiding = useTotalRideTime();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <StatCard icon={<Bike size={18} />} label="Total Rides" value={String(stats.totalRides)} />
      <StatCard icon={<Clock size={18} />} label="Time Riding" value={timeRiding} />
      <StatCard icon={<DollarSign size={18} />} label="Total Spent" value={stats.totalSpent} />
      <StatCard icon={<Leaf size={18} />} label="CO2 Saved" value={stats.co2Saved} />
    </div>
  );
}
