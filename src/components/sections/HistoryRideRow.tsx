import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { Ride } from '../../types';
import RatingStars from '../ui/RatingStars';

interface HistoryRideRowProps {
  ride: Ride;
}

export default function HistoryRideRow({ ride }: HistoryRideRowProps) {
  return (
    <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
      <td className="px-4 py-3">
        <p className="text-sm font-medium text-slate-900">{ride.from} → {ride.to}</p>
      </td>
      <td className="px-4 py-3">
        <p className="text-sm text-slate-600">{ride.scooterName}</p>
        <p className="text-xs text-slate-400">{ride.scooterId}</p>
      </td>
      <td className="px-4 py-3 text-sm text-slate-600">{ride.date}</td>
      <td className="px-4 py-3 text-sm text-slate-600">{ride.duration}</td>
      <td className="px-4 py-3 text-sm text-slate-600">{ride.distance}</td>
      <td className="px-4 py-3 text-sm font-semibold text-slate-900">{ride.cost}</td>
      <td className="px-4 py-3">
        <RatingStars value={ride.rating} size={12} />
      </td>
      <td className="px-4 py-3">
        <Link
          to={`/history/${ride.id}`}
          className="text-primary hover:underline"
          aria-label={`View ride ${ride.id}`}
        >
          <ChevronRight size={16} />
        </Link>
      </td>
    </tr>
  );
}
