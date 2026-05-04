import type { Rental } from '../../types';
import { formatCost } from '../../stores/rideHistoryStore';
import { formatLatLng } from '../../lib/decimal';

interface RideDetailRouteInfoProps {
  ride: Rental;
}

export default function RideDetailRouteInfo({ ride }: RideDetailRouteInfoProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-semibold text-slate-900">Ride {ride.rental_id.slice(0, 8)}</p>
          <p className="text-sm text-slate-500">Scooter {ride.scooter_id}</p>
        </div>
        <span className="text-xl font-bold text-slate-900">{formatCost(ride.total_cost)}</span>
      </div>

      <div className="flex items-start gap-3 mb-2">
        <div className="flex flex-col items-center pt-1">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <div className="w-0.5 h-8 bg-primary/30" />
          <div className="w-3 h-3 rounded-full bg-red-400" />
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <p className="text-sm font-medium text-slate-900">Start</p>
            <p className="text-xs text-slate-500">{formatLatLng(ride.start_lat, ride.start_lon)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">End</p>
            <p className="text-xs text-slate-500">{formatLatLng(ride.end_lat, ride.end_lon)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
