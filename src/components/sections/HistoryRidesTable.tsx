import HistoryRideRow from './HistoryRideRow';
import HistoryFilterPills from './HistoryFilterPills';
import HistoryEmptyState from './HistoryEmptyState';
import { useFilteredRides } from '../../stores/rideHistoryStore';

const COLUMNS = ['Route', 'Scooter', 'Date', 'Duration', 'Distance', 'Cost', 'Rating'];

export default function HistoryRidesTable() {
  const filteredRides = useFilteredRides();

  return (
    <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-slate-100">
        <h3 className="font-semibold text-slate-900">All Rides</h3>
        <HistoryFilterPills />
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100 text-left">
            {COLUMNS.map((col) => (
              <th key={col} className="px-4 py-3 text-xs font-medium text-slate-500 uppercase">
                {col}
              </th>
            ))}
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {filteredRides.map((ride) => (
            <HistoryRideRow key={ride.id} ride={ride} />
          ))}
          {filteredRides.length === 0 && <HistoryEmptyState variant="row" />}
        </tbody>
      </table>
    </div>
  );
}
