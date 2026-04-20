import { useActiveRideStore, formatElapsed } from '../../stores/activeRideStore';

export default function RideTimerCard() {
  const elapsed = useActiveRideStore((s) => s.elapsedSeconds);
  const cost = useActiveRideStore((s) => s.currentCost);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-center">
      <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Ride Duration</p>
      <p
        className="text-5xl sm:text-6xl font-bold text-slate-900 font-mono tracking-wider mb-2"
        aria-live="polite"
        aria-atomic="true"
      >
        {formatElapsed(elapsed)}
      </p>
      <p className="text-sm text-slate-500">
        Current Cost: <span className="text-lg font-bold text-primary">${cost.toFixed(2)}</span>
      </p>
    </div>
  );
}
