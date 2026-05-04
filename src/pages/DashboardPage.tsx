import { useEffect } from 'react';
import DashboardGreeting from '../components/sections/DashboardGreeting';
import StartRideBanner from '../components/sections/StartRideBanner';
import NearbyScootersPreview from '../components/sections/NearbyScootersPreview';
import UserStatsGrid from '../components/sections/UserStatsGrid';
import LastRideCard from '../components/sections/LastRideCard';
import ActivePlanCard from '../components/sections/ActivePlanCard';
import QuickActionsCard from '../components/sections/QuickActionsCard';
import { useAuthStore } from '../stores/authStore';
import { useRideHistoryStore } from '../stores/rideHistoryStore';
import { useScootersStore } from '../stores/scootersStore';

export default function DashboardPage() {
  const userId = useAuthStore((s) => s.user?.user_id ?? null);
  const loadHistory = useRideHistoryStore((s) => s.loadHistory);
  const ridesLoaded = useRideHistoryStore((s) => s.rides.length > 0);
  const loadScooters = useScootersStore((s) => s.loadScooters);
  const scootersLoaded = useScootersStore((s) => s.scooters.length > 0);

  useEffect(() => {
    if (userId && !ridesLoaded) loadHistory(userId, { limit: 50 });
  }, [userId, ridesLoaded, loadHistory]);

  useEffect(() => {
    if (!scootersLoaded) loadScooters();
  }, [scootersLoaded, loadScooters]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl">
      <DashboardGreeting />
      <StartRideBanner />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <NearbyScootersPreview />
          <UserStatsGrid />
          <LastRideCard />
        </div>

        <div className="space-y-6">
          <ActivePlanCard />
          <QuickActionsCard />
        </div>
      </div>
    </div>
  );
}
