import { Clock, Gauge, MapPin, Leaf } from 'lucide-react';
import type { Ride } from '../../types';
import StatCard from '../ui/StatCard';

interface RideCompleteSummaryProps {
  ride: Ride;
}

export default function RideCompleteSummary({ ride }: RideCompleteSummaryProps) {
  const tiles = [
    { icon: <Clock size={16} />, label: 'Duration', value: ride.duration },
    { icon: <Gauge size={16} />, label: 'Avg Speed', value: ride.avgSpeed },
    { icon: <MapPin size={16} />, label: 'Distance', value: ride.distance },
    { icon: <Leaf size={16} />, label: 'CO2 Saved', value: ride.co2Saved },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {tiles.map((t) => (
        <StatCard key={t.label} icon={t.icon} label={t.label} value={t.value} align="center" size="sm" />
      ))}
    </div>
  );
}
