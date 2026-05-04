import { Zap } from 'lucide-react';
import ProgressBar from '../ui/ProgressBar';

interface ActivePlanCardProps {
  // TODO: derive plan name + minute usage from backend once that data is exposed.
  planName?: string;
  minutesRemaining?: number;
  minutesTotal?: number;
}

export default function ActivePlanCard({
  planName = 'Pay-as-you-go',
  minutesRemaining = 38,
  minutesTotal = 60,
}: ActivePlanCardProps) {
  const pct = Math.round((minutesRemaining / minutesTotal) * 100);

  return (
    <div className="bg-gradient-to-br from-primary-light to-white rounded-xl border border-green-200 p-5">
      <div className="flex items-center gap-2 mb-2">
        <Zap size={16} className="text-primary" />
        <span className="text-xs font-medium text-primary">Active Plan</span>
      </div>
      <h4 className="font-semibold text-slate-900 mb-1">{planName}</h4>
      <p className="text-xs text-slate-500 mb-3">{minutesRemaining} min remaining today</p>
      <ProgressBar value={pct} track="green" height="md" />
    </div>
  );
}
