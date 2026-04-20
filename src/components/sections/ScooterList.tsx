import { useAvailableScooters, useScootersStore } from '../../stores/scootersStore';
import ScooterListItem from './ScooterListItem';

export default function ScooterList() {
  const available = useAvailableScooters();
  const selectedId = useScootersStore((s) => s.selectedScooterId);
  const selectScooter = useScootersStore((s) => s.selectScooter);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 space-y-2">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          {available.length} scooters nearby
        </p>
        {available.map((scooter) => (
          <ScooterListItem
            key={scooter.id}
            scooter={scooter}
            selected={selectedId === scooter.id}
            onSelect={selectScooter}
          />
        ))}
      </div>
    </div>
  );
}
