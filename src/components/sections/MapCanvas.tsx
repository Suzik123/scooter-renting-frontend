import { Navigation } from 'lucide-react';
import MapPlaceholder from '../MapPlaceholder';

const DOTS = [
  { top: '25%', left: '35%' },
  { top: '40%', left: '55%' },
  { top: '30%', left: '70%' },
  { top: '60%', left: '30%' },
  { top: '50%', left: '48%' },
  { top: '70%', left: '65%' },
  { top: '20%', left: '50%' },
];

export default function MapCanvas() {
  return (
    <div className="flex-1 relative order-1 lg:order-2 min-h-[200px] lg:min-h-0">
      <MapPlaceholder className="w-full h-full rounded-none" scooterDots={DOTS} />
      <button
        className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"
        aria-label="Re-center map"
      >
        <Navigation size={18} className="text-slate-600" />
      </button>
    </div>
  );
}
