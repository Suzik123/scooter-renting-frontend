import { Link } from 'react-router-dom';
import { Bike, MapPin, Clock, DollarSign, Leaf, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import Badge from '../components/ui/Badge';
import RatingStars from '../components/ui/RatingStars';
import {
  useRideHistoryStore,
  useFilteredRides,
  useGroupedRides,
  type HistoryFilter,
} from '../stores/rideHistoryStore';

const FILTER_OPTIONS: HistoryFilter[] = ['All', 'This Week', 'Last Week', 'This Month'];

export default function HistoryPage() {
  const stats = useRideHistoryStore((s) => s.stats);
  const filter = useRideHistoryStore((s) => s.filter);
  const setFilter = useRideHistoryStore((s) => s.setFilter);
  const filteredRides = useFilteredRides();
  const groups = useGroupedRides();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">Ride History</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Bike size={16} className="text-primary" />
            <span className="text-xs text-slate-500">Total Rides</span>
          </div>
          <p className="text-lg font-bold text-slate-900">{stats.totalRides}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-1">
            <MapPin size={16} className="text-primary" />
            <span className="text-xs text-slate-500">Distance</span>
          </div>
          <p className="text-lg font-bold text-slate-900">{stats.totalDistance}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign size={16} className="text-primary" />
            <span className="text-xs text-slate-500">Spent</span>
          </div>
          <p className="text-lg font-bold text-slate-900">{stats.totalSpent}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Leaf size={16} className="text-primary" />
            <span className="text-xs text-slate-500">CO2 Saved</span>
          </div>
          <p className="text-lg font-bold text-slate-900">{stats.co2Saved}</p>
        </div>
      </div>

      <div className="lg:hidden flex gap-2 mb-4 overflow-x-auto" role="tablist" aria-label="Ride filter">
        {FILTER_OPTIONS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            role="tab"
            aria-selected={filter === f}
            className={clsx(
              'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer',
              filter === f ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-900">All Rides</h3>
          <div className="flex gap-2" role="tablist" aria-label="Ride filter">
            {FILTER_OPTIONS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                role="tab"
                aria-selected={filter === f}
                className={clsx(
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer',
                  filter === f ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 text-left">
              <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase">Route</th>
              <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase">Scooter</th>
              <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase">Date</th>
              <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase">Duration</th>
              <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase">Distance</th>
              <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase">Cost</th>
              <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase">Rating</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filteredRides.map((ride) => (
              <tr key={ride.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-slate-900">{ride.from} → {ride.to}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-slate-600">{ride.scooterName}</p>
                  <p className="text-xs text-slate-400">{ride.scooterId}</p>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">{ride.date}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{ride.duration}</td>
                <td className="px-4 py-3 text-sm text-slate-600">{ride.distance}</td>
                <td className="px-4 py-3 text-sm font-semibold text-slate-900">{ride.cost}</td>
                <td className="px-4 py-3">
                  <RatingStars value={ride.rating} size={12} />
                </td>
                <td className="px-4 py-3">
                  <Link to={`/history/${ride.id}`} className="text-primary hover:underline" aria-label={`View ride ${ride.id}`}>
                    <ChevronRight size={16} />
                  </Link>
                </td>
              </tr>
            ))}
            {filteredRides.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-sm text-slate-500">
                  No rides match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden space-y-6">
        {Object.entries(groups).length === 0 && (
          <p className="text-sm text-slate-500 text-center py-8">No rides match this filter.</p>
        )}
        {Object.entries(groups).map(([label, rides]) => (
          <div key={label}>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">{label}</h3>
            <div className="space-y-3">
              {rides.map((ride) => (
                <Link
                  key={ride.id}
                  to={`/history/${ride.id}`}
                  className="block bg-white rounded-xl shadow-sm border border-slate-100 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-3">
                    <div className="w-16 h-16 bg-[#E8E4D9] rounded-lg flex-shrink-0 relative overflow-hidden">
                      <div className="absolute inset-0">
                        {[30, 60].map((pos) => (
                          <div key={`h-${pos}`} className="absolute left-0 right-0 border-t border-[#D4D0C8]" style={{ top: `${pos}%` }} />
                        ))}
                        {[30, 60].map((pos) => (
                          <div key={`v-${pos}`} className="absolute top-0 bottom-0 border-l border-[#D4D0C8]" style={{ left: `${pos}%` }} />
                        ))}
                      </div>
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M 20 30 Q 50 50, 75 70" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <p className="font-medium text-sm text-slate-900 truncate">{ride.from} → {ride.to}</p>
                        <span className="text-sm font-semibold text-slate-900 ml-2 flex-shrink-0">{ride.cost}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                        <span className="flex items-center gap-1"><Clock size={12} /> {ride.duration}</span>
                        <span className="flex items-center gap-1"><MapPin size={12} /> {ride.distance}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <RatingStars value={ride.rating} size={10} />
                        <Badge variant={ride.status === 'completed' ? 'success' : 'default'}>
                          {ride.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
