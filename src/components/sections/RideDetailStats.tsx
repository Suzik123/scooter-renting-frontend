import { Clock, MapPin, Zap, Bike } from 'lucide-react';
import type { Ride } from '../../types';
import StatCard from '../ui/StatCard';

interface RideDetailStatsProps {
  ride: Ride;
}

export default function RideDetailStats({ ride }: RideDetailStatsProps) {
  const tiles = [
    { icon: <Clock size={18} />, label: 'Duration', value: ride.duration },
    { icon: <MapPin size={18} />, label: 'Distance', value: ride.distance },
    { icon: <Zap size={18} />, label: 'Avg Speed', value: ride.avgSpeed },
    { icon: <Bike size={18} />, label: 'Scooter', value: ride.scooterName },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
      {tiles.map((t) => (
        <StatCard key={t.label} icon={t.icon} label={t.label} value={t.value} align="center" />
      ))}
    </div>
  );
}
