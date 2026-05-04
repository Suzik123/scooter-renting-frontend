import { Bike, MapPin, DollarSign, Leaf } from 'lucide-react';
import { useRideHistoryStore } from '../../stores/rideHistoryStore';
import { toNum } from '../../lib/decimal';

const CO2_PER_KM_KG = 0.21;

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export default function HistoryStatsGrid() {
  const rides = useRideHistoryStore((s) => s.rides);

  const totalDistanceM = rides.reduce((sum, r) => sum + (r.distance_m ?? 0), 0);
  const totalSpent = rides.reduce((sum, r) => sum + toNum(r.total_cost), 0);
  const co2Saved = (totalDistanceM / 1000) * CO2_PER_KM_KG;

  const tiles = [
    { icon: Bike, label: 'Total Rides', value: String(rides.length) },
    { icon: MapPin, label: 'Distance', value: formatDistance(totalDistanceM) },
    { icon: DollarSign, label: 'Spent', value: `$${totalSpent.toFixed(2)}` },
    { icon: Leaf, label: 'CO2 Saved', value: `${co2Saved.toFixed(1)} kg` },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {tiles.map((t) => (
        <div key={t.label} className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-1">
            <t.icon size={16} className="text-primary" />
            <span className="text-xs text-slate-500">{t.label}</span>
          </div>
          <p className="text-lg font-bold text-slate-900">{t.value}</p>
        </div>
      ))}
    </div>
  );
}
