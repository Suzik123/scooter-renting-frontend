import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface RideDetailHeaderProps {
  rideId: string;
  date: string;
}

export default function RideDetailHeader({ rideId, date }: RideDetailHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <Link
        to="/history"
        className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
        aria-label="Back to history"
      >
        <ArrowLeft size={18} className="text-slate-600" />
      </Link>
      <div>
        <h1 className="text-lg font-bold text-slate-900">Ride #{rideId}</h1>
        <p className="text-xs text-slate-500">{date}</p>
      </div>
    </div>
  );
}
