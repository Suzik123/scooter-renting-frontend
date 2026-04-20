import { Gauge, Navigation } from 'lucide-react';
import MapPlaceholder from '../MapPlaceholder';

interface RideMapCardProps {
  variant?: 'active' | 'complete';
  routeLabel?: string;
  speed?: number;
}

export default function RideMapCard({ variant = 'active', routeLabel = 'Central Park Area', speed = 12 }: RideMapCardProps) {
  if (variant === 'complete') {
    return (
      <div className="bg-dark-card rounded-2xl h-64 lg:h-full min-h-[300px] relative overflow-hidden">
        <div className="absolute inset-0">
          {[20, 40, 60, 80].map((pos) => (
            <div key={`h-${pos}`} className="absolute left-0 right-0 border-t border-slate-700/30" style={{ top: `${pos}%` }} />
          ))}
          {[20, 40, 60, 80].map((pos) => (
            <div key={`v-${pos}`} className="absolute top-0 bottom-0 border-l border-slate-700/30" style={{ left: `${pos}%` }} />
          ))}
        </div>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d="M 25 30 C 35 30, 40 40, 45 50 S 60 65, 72 60"
            fill="none"
            stroke="#22C55E"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
          <circle cx="25" cy="30" r="3" fill="#22C55E" />
          <circle cx="25" cy="30" r="1.5" fill="white" />
          <circle cx="72" cy="60" r="3" fill="#EF4444" />
          <circle cx="72" cy="60" r="1.5" fill="white" />
        </svg>
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5">
          <p className="text-xs font-medium text-slate-700">{routeLabel}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <MapPlaceholder
        className="h-64 lg:h-full min-h-[300px]"
        showRoute
        scooterDots={[{ top: '50%', left: '48%' }]}
      />
      <div className="absolute bottom-4 right-4 bg-white rounded-xl shadow-lg p-3 text-center min-w-[80px]">
        <Gauge size={18} className="text-primary mx-auto mb-1" />
        <p className="text-xl font-bold text-slate-900">{speed}</p>
        <p className="text-xs text-slate-500">km/h</p>
      </div>
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md px-3 py-2 flex items-center gap-2">
        <Navigation size={14} className="text-primary" />
        <span className="text-xs font-medium text-slate-700">{routeLabel}</span>
      </div>
    </div>
  );
}
