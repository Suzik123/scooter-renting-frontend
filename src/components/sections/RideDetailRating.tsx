import RatingStars from '../ui/RatingStars';

interface RideDetailRatingProps {
  rating: number;
}

export default function RideDetailRating({ rating }: RideDetailRatingProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
      <h3 className="font-semibold text-slate-900 mb-3">Your Rating</h3>
      <RatingStars value={rating} size={24} />
    </div>
  );
}
