import type { Ride } from '../../types';

interface RideDetailRouteInfoProps {
  ride: Ride;
}

export default function RideDetailRouteInfo({ ride }: RideDetailRouteInfoProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-semibold text-slate-900">{ride.from} → {ride.to}</p>
          <p className="text-sm text-slate-500">{ride.scooterName} ({ride.scooterId})</p>
        </div>
        <span className="text-xl font-bold text-slate-900">{ride.cost}</span>
      </div>

      <div className="flex items-start gap-3 mb-2">
        <div className="flex flex-col items-center">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <div className="w-0.5 h-8 bg-primary/30" />
          <div className="w-3 h-3 rounded-full bg-red-400" />
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <p className="text-sm font-medium text-slate-900">{ride.from}</p>
            <p className="text-xs text-slate-500">Start point</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">{ride.to}</p>
            <p className="text-xs text-slate-500">End point</p>
          </div>
        </div>
      </div>
    </div>
  );
}
