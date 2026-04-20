import { clsx } from 'clsx';
import { Battery, MapPin } from 'lucide-react';
import type { Scooter } from '../../types';
import ProgressBar, { batteryColor } from '../ui/ProgressBar';

interface ScooterListItemProps {
  scooter: Scooter;
  selected: boolean;
  onSelect: (id: string) => void;
}

export default function ScooterListItem({ scooter, selected, onSelect }: ScooterListItemProps) {
  return (
    <button
      onClick={() => onSelect(scooter.id)}
      aria-pressed={selected}
      className={clsx(
        'w-full text-left p-3 rounded-xl border transition-colors cursor-pointer',
        selected ? 'border-primary bg-primary-light' : 'border-slate-100 bg-white hover:bg-slate-50',
      )}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium text-sm text-slate-900">{scooter.name}</span>
        <span className="text-xs text-slate-500">{scooter.price}</span>
      </div>
      <div className="flex items-center gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1"><Battery size={12} /> {scooter.battery}%</span>
        <span className="flex items-center gap-1"><MapPin size={12} /> {scooter.distance}</span>
        <span className="text-slate-400">ID: {scooter.id}</span>
      </div>
      <ProgressBar value={scooter.battery} color={batteryColor(scooter.battery)} height="xs" className="mt-2" />
    </button>
  );
}
