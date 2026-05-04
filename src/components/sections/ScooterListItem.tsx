import { clsx } from 'clsx';
import { Battery, MapPin } from 'lucide-react';
import type { Scooter } from '../../types';
import ProgressBar, { batteryColor } from '../ui/ProgressBar';
import { distanceFromUser, useScootersStore } from '../../stores/scootersStore';

interface ScooterListItemProps {
  scooter: Scooter;
  selected: boolean;
  onSelect: (id: string) => void;
}

export default function ScooterListItem({ scooter, selected, onSelect }: ScooterListItemProps) {
  const userLocation = useScootersStore((s) => s.userLocation);
  const distanceLabel = distanceFromUser(scooter, userLocation);
  const label = scooter.model || `Scooter ${scooter.scooter_id}`;

  return (
    <button
      onClick={() => onSelect(scooter.scooter_id)}
      aria-pressed={selected}
      className={clsx(
        'w-full text-left p-3 rounded-xl border transition-colors cursor-pointer',
        selected ? 'border-primary bg-primary-light' : 'border-slate-100 bg-white hover:bg-slate-50',
      )}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium text-sm text-slate-900 truncate">{label}</span>
        <span className="text-xs text-slate-500">{distanceLabel}</span>
      </div>
      <div className="flex items-center gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1"><Battery size={12} /> {scooter.battery_level}%</span>
        <span className="flex items-center gap-1"><MapPin size={12} /> {distanceLabel}</span>
        <span className="text-slate-400 truncate">ID: {scooter.scooter_id}</span>
      </div>
      <ProgressBar value={scooter.battery_level} color={batteryColor(scooter.battery_level)} height="xs" className="mt-2" />
    </button>
  );
}
