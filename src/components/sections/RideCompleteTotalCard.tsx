import type { Ride } from '../../types';
import Badge from '../ui/Badge';

interface RideCompleteTotalCardProps {
  ride: Ride;
}

export default function RideCompleteTotalCard({ ride }: RideCompleteTotalCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 text-center">
      <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Total Cost</p>
      <p className="text-4xl font-bold text-slate-900 mb-2">{ride.cost}</p>
      <Badge variant="success">Paid via Wallet</Badge>
    </div>
  );
}
