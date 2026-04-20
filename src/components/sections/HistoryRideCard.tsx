import { Link } from 'react-router-dom';
import { Clock, MapPin } from 'lucide-react';
import type { Ride } from '../../types';
import Badge from '../ui/Badge';
import RatingStars from '../ui/RatingStars';

interface HistoryRideCardProps {
  ride: Ride;
}

export default function HistoryRideCard({ ride }: HistoryRideCardProps) {
  return (
    <Link
      to={`/history/${ride.id}`}
      className="block bg-white rounded-xl shadow-sm border border-slate-100 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex gap-3">
        <div className="w-16 h-16 bg-[#E8E4D9] rounded-lg flex-shrink-0 relative overflow-hidden">
          <div className="absolute inset-0">
            {[30, 60].map((pos) => (
              <div
                key={`h-${pos}`}
                className="absolute left-0 right-0 border-t border-[#D4D0C8]"
                style={{ top: `${pos}%` }}
              />
            ))}
            {[30, 60].map((pos) => (
              <div
                key={`v-${pos}`}
                className="absolute top-0 bottom-0 border-l border-[#D4D0C8]"
                style={{ left: `${pos}%` }}
              />
            ))}
          </div>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M 20 30 Q 50 50, 75 70" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <p className="font-medium text-sm text-slate-900 truncate">
              {ride.from} → {ride.to}
            </p>
            <span className="text-sm font-semibold text-slate-900 ml-2 flex-shrink-0">{ride.cost}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <span className="flex items-center gap-1"><Clock size={12} /> {ride.duration}</span>
            <span className="flex items-center gap-1"><MapPin size={12} /> {ride.distance}</span>
          </div>
          <div className="flex items-center justify-between">
            <RatingStars value={ride.rating} size={10} />
            <Badge variant={ride.status === 'completed' ? 'success' : 'default'}>{ride.status}</Badge>
          </div>
        </div>
      </div>
    </Link>
  );
}
