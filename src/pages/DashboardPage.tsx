import DashboardGreeting from '../components/sections/DashboardGreeting';
import StartRideBanner from '../components/sections/StartRideBanner';
import NearbyScootersPreview from '../components/sections/NearbyScootersPreview';
import UserStatsGrid from '../components/sections/UserStatsGrid';
import LastRideCard from '../components/sections/LastRideCard';
import WalletBalanceCard from '../components/sections/WalletBalanceCard';
import ActivePlanCard from '../components/sections/ActivePlanCard';
import QuickActionsCard from '../components/sections/QuickActionsCard';

export default function DashboardPage() {
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
          <WalletBalanceCard variant="compact" />
          <ActivePlanCard />
          <QuickActionsCard />
        </div>
      </div>
    </div>
  );
}
