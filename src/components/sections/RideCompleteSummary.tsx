import { Clock, Gauge, MapPin, Leaf } from 'lucide-react';
import type { Rental } from '../../types';
import StatCard from '../ui/StatCard';
import { rentalDurationSeconds, formatDistance, formatDurationLabel } from '../../stores/rideHistoryStore';

interface RideCompleteSummaryProps {
  rental: Rental;
}

const CO2_PER_KM_KG = 0.21;

export default function RideCompleteSummary({ rental }: RideCompleteSummaryProps) {
  const seconds = rentalDurationSeconds(rental);
  const km = (rental.distance_m ?? 0) / 1000;
  const avgSpeed = seconds > 0 ? (km / (seconds / 3600)).toFixed(1) : '0.0';
  const co2 = (km * CO2_PER_KM_KG).toFixed(1);

  const tiles = [
    { icon: <Clock size={16} />, label: 'Duration', value: formatDurationLabel(seconds) },
    { icon: <Gauge size={16} />, label: 'Avg Speed', value: `${avgSpeed} km/h` },
    { icon: <MapPin size={16} />, label: 'Distance', value: formatDistance(rental.distance_m) },
    { icon: <Leaf size={16} />, label: 'CO2 Saved', value: `${co2} kg` },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {tiles.map((t) => (
        <StatCard key={t.label} icon={t.icon} label={t.label} value={t.value} align="center" size="sm" />
      ))}
    </div>
  );
}
