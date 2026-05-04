import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRideHistoryStore } from '../stores/rideHistoryStore';
import { useAuthStore } from '../stores/authStore';
import RideDetailHeader from '../components/sections/RideDetailHeader';
import RideMapCard from '../components/sections/RideMapCard';
import RideDetailRouteInfo from '../components/sections/RideDetailRouteInfo';
import RideDetailStats from '../components/sections/RideDetailStats';
import RideDetailCostBreakdown from '../components/sections/RideDetailCostBreakdown';

export default function RideDetailPage() {
  const { id } = useParams();
  const rides = useRideHistoryStore((s) => s.rides);
  const loading = useRideHistoryStore((s) => s.loading);
  const loadHistory = useRideHistoryStore((s) => s.loadHistory);
  const userId = useAuthStore((s) => s.user?.user_id ?? null);
  const ride = rides.find((r) => r.rental_id === id);

  useEffect(() => {
    if (rides.length === 0 && userId) {
      loadHistory(userId, { limit: 50 });
    }
  }, [rides.length, userId, loadHistory]);

  if (!ride) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
        <p className="text-sm text-slate-500">{loading ? 'Loading ride...' : 'Ride not found.'}</p>
        <Link to="/history" className="text-sm text-primary hover:underline">Back to history</Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
      <RideDetailHeader rideId={ride.rental_id} startTime={ride.start_time} />
      <RideMapCard variant="detail" />
      <RideDetailRouteInfo ride={ride} />
      <RideDetailStats ride={ride} />
      <RideDetailCostBreakdown ride={ride} />
    </div>
  );
}
