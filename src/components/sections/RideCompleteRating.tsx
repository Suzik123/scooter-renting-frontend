import { useNavigate } from 'react-router-dom';
import RatingStars from '../ui/RatingStars';
import { useLastRide, useRideHistoryStore } from '../../stores/rideHistoryStore';

export default function RideCompleteRating() {
  const lastRide = useLastRide();
  const rateRide = useRideHistoryStore((s) => s.rateRide);
  const navigate = useNavigate();

  if (!lastRide) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
      <h3 className="font-semibold text-slate-900 mb-3 text-center lg:text-left">Rate your ride</h3>
      <div className="flex justify-center lg:justify-start">
        <RatingStars
          value={lastRide.rating}
          readonly={false}
          size={28}
          onChange={(v) => {
            rateRide(lastRide.id, v);
            navigate('/history');
          }}
        />
      </div>
    </div>
  );
}
