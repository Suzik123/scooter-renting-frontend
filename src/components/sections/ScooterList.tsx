import { useAvailableScooters, useScootersStore } from '../../stores/scootersStore';
import ScooterListItem from './ScooterListItem';

export default function ScooterList() {
  const available = useAvailableScooters();
  const loading = useScootersStore((s) => s.loading);
  const error = useScootersStore((s) => s.error);
  const selectedId = useScootersStore((s) => s.selectedScooterId);
  const selectScooter = useScootersStore((s) => s.selectScooter);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 space-y-2">
        {error && (
          <p className="text-xs text-red-600" role="alert">{error}</p>
        )}
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          {loading && available.length === 0
            ? 'Loading scooters...'
            : `${available.length} scooters nearby`}
        </p>
        {available.map((scooter) => (
          <ScooterListItem
            key={scooter.scooter_id}
            scooter={scooter}
            selected={selectedId === scooter.scooter_id}
            onSelect={selectScooter}
          />
        ))}
        {!loading && available.length === 0 && !error && (
          <p className="text-sm text-slate-500">No scooters available right now.</p>
        )}
      </div>
    </div>
  );
}
