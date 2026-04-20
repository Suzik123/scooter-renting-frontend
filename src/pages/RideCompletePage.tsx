import { Link } from 'react-router-dom';
import RideMapCard from '../components/sections/RideMapCard';
import RideCompleteHero from '../components/sections/RideCompleteHero';
import RideCompleteTotalCard from '../components/sections/RideCompleteTotalCard';
import RideCompleteSummary from '../components/sections/RideCompleteSummary';
import RideCompleteRating from '../components/sections/RideCompleteRating';
import RideCompleteActions from '../components/sections/RideCompleteActions';
import { useLastRide } from '../stores/rideHistoryStore';

export default function RideCompletePage() {
  const lastRide = useLastRide();

  if (!lastRide) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
        <p className="text-sm text-slate-500">No completed ride to show.</p>
        <Link to="/map" className="text-sm text-primary hover:underline">Back to map</Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-6">
        <RideMapCard variant="complete" routeLabel={`${lastRide.from} → ${lastRide.to}`} />

        <div className="space-y-6">
          <RideCompleteHero />
          <RideCompleteTotalCard ride={lastRide} />
          <RideCompleteSummary ride={lastRide} />
          <RideCompleteRating />
          <RideCompleteActions />
        </div>
      </div>
    </div>
  );
}
