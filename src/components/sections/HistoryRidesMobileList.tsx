import HistoryRideGroup from './HistoryRideGroup';
import HistoryEmptyState from './HistoryEmptyState';
import { useGroupedRides } from '../../stores/rideHistoryStore';

export default function HistoryRidesMobileList() {
  const groups = useGroupedRides();
  const entries = Object.entries(groups);

  return (
    <div className="lg:hidden space-y-6">
      {entries.length === 0 ? (
        <HistoryEmptyState />
      ) : (
        entries.map(([label, rides]) => <HistoryRideGroup key={label} label={label} rides={rides} />)
      )}
    </div>
  );
}
