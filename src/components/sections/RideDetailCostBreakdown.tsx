import type { Ride } from '../../types';

interface RideDetailCostBreakdownProps {
  ride: Ride;
}

export default function RideDetailCostBreakdown({ ride }: RideDetailCostBreakdownProps) {
  const totalNumeric = parseFloat(ride.cost.replace(/[^0-9.]/g, ''));
  const rideTimeCost = Number.isFinite(totalNumeric)
    ? `$${(totalNumeric - 1).toFixed(2)}`
    : ride.cost;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 mb-4">
      <h3 className="font-semibold text-slate-900 mb-4">Cost Breakdown</h3>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Unlock fee</span>
          <span className="text-slate-900">$1.00</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Ride time ({ride.duration})</span>
          <span className="text-slate-900">{rideTimeCost}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500">Weekly Pass discount</span>
          <span className="text-green-600">-$0.00</span>
        </div>
        <div className="border-t border-slate-100 pt-3 flex justify-between">
          <span className="font-semibold text-slate-900">Total Charged</span>
          <span className="font-bold text-slate-900">{ride.cost}</span>
        </div>
      </div>
    </div>
  );
}
