import { Bike, MapPin, DollarSign, Leaf } from 'lucide-react';
import { useRideHistoryStore } from '../../stores/rideHistoryStore';

export default function HistoryStatsGrid() {
  const stats = useRideHistoryStore((s) => s.stats);

  const tiles = [
    { icon: Bike, label: 'Total Rides', value: String(stats.totalRides) },
    { icon: MapPin, label: 'Distance', value: stats.totalDistance },
    { icon: DollarSign, label: 'Spent', value: stats.totalSpent },
    { icon: Leaf, label: 'CO2 Saved', value: stats.co2Saved },
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
