import { Link } from 'react-router-dom';
import { Bike } from 'lucide-react';
import IconTile from '../ui/IconTile';
import RatingStars from '../ui/RatingStars';
import SectionHeader from '../ui/SectionHeader';
import { useLastRide } from '../../stores/rideHistoryStore';

export default function LastRideCard() {
  const lastRide = useLastRide();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 sm:p-5">
      <SectionHeader
        title="Last Ride"
        className="mb-4"
        action={
          <Link to="/history" className="text-sm text-primary font-medium hover:underline">
            View All
          </Link>
        }
      />
      {lastRide ? (
        <Link
          to={`/history/${lastRide.id}`}
          className="block hover:bg-slate-50 rounded-lg -mx-2 px-2 py-2 transition-colors"
        >
          <div className="flex items-center gap-4">
            <IconTile tone="primary" size="lg" className="rounded-xl">
              <Bike size={20} className="text-primary" />
            </IconTile>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-900 text-sm">{lastRide.from} → {lastRide.to}</p>
              <p className="text-xs text-slate-500">
                {lastRide.scooterName} · {lastRide.duration} · {lastRide.distance}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-semibold text-slate-900 text-sm">{lastRide.cost}</p>
              <RatingStars value={lastRide.rating} size={10} className="justify-end" />
            </div>
          </div>
        </Link>
      ) : (
        <p className="text-sm text-slate-500">No rides yet.</p>
      )}
    </div>
  );
}
