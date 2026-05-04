import { Clock, MapPin, Zap, Bike } from 'lucide-react';
import type { Rental } from '../../types';
import StatCard from '../ui/StatCard';
import { rentalDurationSeconds, formatDurationLabel, formatDistance } from '../../stores/rideHistoryStore';

interface RideDetailStatsProps {
  ride: Rental;
}

export default function RideDetailStats({ ride }: RideDetailStatsProps) {
  const seconds = rentalDurationSeconds(ride);
  const km = (ride.distance_m ?? 0) / 1000;
  const avgSpeed = seconds > 0 ? `${(km / (seconds / 3600)).toFixed(1)} km/h` : '0.0 km/h';

  const tiles = [
    { icon: <Clock size={18} />, label: 'Duration', value: formatDurationLabel(seconds) },
    { icon: <MapPin size={18} />, label: 'Distance', value: formatDistance(ride.distance_m) },
    { icon: <Zap size={18} />, label: 'Avg Speed', value: avgSpeed },
    { icon: <Bike size={18} />, label: 'Scooter', value: ride.scooter_id },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
      {tiles.map((t) => (
        <StatCard key={t.label} icon={t.icon} label={t.label} value={t.value} align="center" />
      ))}
    </div>
  );
}
