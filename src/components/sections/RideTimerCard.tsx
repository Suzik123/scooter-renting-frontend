import { useTranslation } from 'react-i18next';
import { useActiveRideStore, formatElapsed } from '../../stores/activeRideStore';

function formatMoney(amount: number, currency: string, locale: string): string {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
  } catch {
    return `$${amount.toFixed(2)}`;
  }
}

export default function RideTimerCard() {
  const { t, i18n } = useTranslation('ride');
  const locale = i18n.resolvedLanguage === 'pl' ? 'pl-PL' : 'en-US';
  const ride = useActiveRideStore((s) => s.activeRide);
  const elapsed = useActiveRideStore((s) => s.elapsedSeconds);
  const cost = useActiveRideStore((s) => s.currentCost);

  const currency = ride?.currency ?? 'USD';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-center">
      <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">{t('active.duration')}</p>
      <p
        className="text-5xl sm:text-6xl font-bold text-slate-900 font-mono tracking-wider mb-2"
        aria-live="polite"
        aria-atomic="true"
      >
        {formatElapsed(elapsed)}
      </p>
      <p className="text-sm text-slate-500">
        {t('active.currentCost')} <span className="text-lg font-bold text-primary">{formatMoney(cost, currency, locale)}</span>
      </p>
    </div>
  );
}
