import HistoryRideRow from './HistoryRideRow';
import HistoryFilterPills from './HistoryFilterPills';
import HistoryEmptyState from './HistoryEmptyState';
import { useFilteredRides, useRideHistoryStore } from '../../stores/rideHistoryStore';

const COLUMNS = ['Ride', 'Scooter', 'Date', 'Duration', 'Distance', 'Cost', 'Status'];

export default function HistoryRidesTable() {
  const filteredRides = useFilteredRides();
  const loading = useRideHistoryStore((s) => s.loading);

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
            <HistoryRideRow key={ride.rental_id} ride={ride} />
          ))}
          {!loading && filteredRides.length === 0 && <HistoryEmptyState variant="row" />}
          {loading && filteredRides.length === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-500">
                Loading rides...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
