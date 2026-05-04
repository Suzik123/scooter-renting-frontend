import { useActiveRideStore, formatElapsed } from '../../stores/activeRideStore';

function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

export default function RideTimerCard() {
  const ride = useActiveRideStore((s) => s.activeRide);
  const elapsed = useActiveRideStore((s) => s.elapsedSeconds);
  const cost = useActiveRideStore((s) => s.currentCost);

  const currency = ride?.currency ?? 'USD';

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
        Current Cost: <span className="text-lg font-bold text-primary">{formatMoney(cost, currency)}</span>
      </p>
    </div>
  );
}
