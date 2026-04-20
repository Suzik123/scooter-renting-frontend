import HistoryStatsGrid from '../components/sections/HistoryStatsGrid';
import HistoryFilterPills from '../components/sections/HistoryFilterPills';
import HistoryRidesTable from '../components/sections/HistoryRidesTable';
import HistoryRidesMobileList from '../components/sections/HistoryRidesMobileList';

export default function HistoryPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">Ride History</h1>
      <HistoryStatsGrid />
      <HistoryFilterPills className="lg:hidden mb-4" />
      <HistoryRidesTable />
      <HistoryRidesMobileList />
    </div>
  );
}
