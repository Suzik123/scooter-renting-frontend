import { Link } from 'react-router-dom';
import { Bike, PlayCircle } from 'lucide-react';
import { useAvailableScooters } from '../../stores/scootersStore';
import { useActiveRideStore } from '../../stores/activeRideStore';

export default function StartRideBanner() {
  const available = useAvailableScooters();
  const activeRide = useActiveRideStore((s) => s.activeRide);

  if (activeRide) {
    return (
      <Link
        to="/ride/active"
        className="block bg-gradient-to-r from-primary to-emerald-600 rounded-2xl p-5 sm:p-6 mb-6 text-white hover:shadow-lg transition-shadow"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/80 mb-1">Ride in progress</p>
            <h2 className="text-lg sm:text-xl font-bold mb-1">Resume Active Ride</h2>
            <p className="text-sm text-white/80">{activeRide.scooterName} · {activeRide.scooterId}</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <PlayCircle size={24} />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to="/map"
      className="block bg-gradient-to-r from-primary to-emerald-600 rounded-2xl p-5 sm:p-6 mb-6 text-white hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/80 mb-1">Ready to ride?</p>
          <h2 className="text-lg sm:text-xl font-bold mb-1">Start a Ride</h2>
          <p className="text-sm text-white/80">{available.length} scooters nearby</p>
        </div>
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <Bike size={24} />
        </div>
      </div>
    </Link>
  );
}
