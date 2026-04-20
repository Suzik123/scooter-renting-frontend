import { useParams, Link } from 'react-router-dom';
import { useRideHistoryStore } from '../stores/rideHistoryStore';
import RideDetailHeader from '../components/sections/RideDetailHeader';
import RideMapCard from '../components/sections/RideMapCard';
import RideDetailRouteInfo from '../components/sections/RideDetailRouteInfo';
import RideDetailStats from '../components/sections/RideDetailStats';
import RideDetailCostBreakdown from '../components/sections/RideDetailCostBreakdown';
import RideDetailRating from '../components/sections/RideDetailRating';

export default function RideDetailPage() {
  const { id } = useParams();
  const rides = useRideHistoryStore((s) => s.rides);
  const ride = rides.find((r) => r.id === id);

  if (!ride) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
        <p className="text-sm text-slate-500">Ride not found.</p>
        <Link to="/history" className="text-sm text-primary hover:underline">Back to history</Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
      <RideDetailHeader rideId={ride.id} date={ride.date} />
      <RideMapCard variant="detail" />
      <RideDetailRouteInfo ride={ride} />
      <RideDetailStats ride={ride} />
      <RideDetailCostBreakdown ride={ride} />
      <RideDetailRating rating={ride.rating} />
    </div>
  );
}
