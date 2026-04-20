import { clsx } from 'clsx';

interface MapPlaceholderProps {
  className?: string;
  scooterDots?: Array<{ top: string; left: string }>;
  showRoute?: boolean;
}

const defaultDots = [
  { top: '20%', left: '30%' },
  { top: '45%', left: '60%' },
  { top: '30%', left: '75%' },
  { top: '65%', left: '25%' },
  { top: '55%', left: '45%' },
  { top: '75%', left: '70%' },
  { top: '15%', left: '55%' },
];

export default function MapPlaceholder({ className, scooterDots = defaultDots, showRoute = false }: MapPlaceholderProps) {
  return (
    <div
      className={clsx(
        'relative bg-[#E8E4D9] overflow-hidden rounded-xl',
        className,
      )}
    >
      {/* Grid lines to simulate streets */}
      <div className="absolute inset-0">
        {/* Horizontal lines */}
        {[15, 30, 45, 60, 75, 90].map((pos) => (
          <div key={`h-${pos}`} className="absolute left-0 right-0 border-t border-[#D4D0C8]" style={{ top: `${pos}%` }} />
        ))}
        {/* Vertical lines */}
        {[15, 30, 45, 60, 75, 90].map((pos) => (
          <div key={`v-${pos}`} className="absolute top-0 bottom-0 border-l border-[#D4D0C8]" style={{ left: `${pos}%` }} />
        ))}
        {/* Some wider "main roads" */}
        <div className="absolute left-0 right-0 h-1 bg-[#CDC9BE]" style={{ top: '45%' }} />
        <div className="absolute top-0 bottom-0 w-1 bg-[#CDC9BE]" style={{ left: '60%' }} />
      </div>

      {/* Route line */}
      {showRoute && (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d="M 25 30 Q 40 35, 45 45 T 70 65"
            fill="none"
            stroke="#22C55E"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
          <circle cx="25" cy="30" r="2" fill="#22C55E" />
          <circle cx="70" cy="65" r="2" fill="#EF4444" />
        </svg>
      )}

      {/* Scooter dots */}
      {scooterDots.map((dot, i) => (
        <div
          key={i}
          className="absolute w-3 h-3 bg-primary rounded-full shadow-sm border-2 border-white"
          style={{ top: dot.top, left: dot.left, transform: 'translate(-50%, -50%)' }}
        />
      ))}
    </div>
  );
}
