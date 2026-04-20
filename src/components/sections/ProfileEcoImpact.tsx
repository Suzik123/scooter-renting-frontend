import { Leaf } from 'lucide-react';
import ProgressBar from '../ui/ProgressBar';
import { userStats } from '../../mock/data';

export default function ProfileEcoImpact() {
  return (
    <div className="hidden lg:block mt-6 bg-gradient-to-br from-primary-light to-white rounded-xl border border-green-200 p-5">
      <div className="flex items-center gap-2 mb-3">
        <Leaf size={18} className="text-primary" />
        <h3 className="font-semibold text-slate-900">Eco Impact</h3>
      </div>
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-slate-600">CO2 Saved</span>
            <span className="font-semibold text-slate-900">{userStats.co2Saved}</span>
          </div>
          <ProgressBar value={71} track="green" height="md" />
        </div>
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-slate-600">Green Rides</span>
            <span className="font-semibold text-slate-900">47 / 50</span>
          </div>
          <ProgressBar value={94} track="green" height="md" />
        </div>
      </div>
    </div>
  );
}
