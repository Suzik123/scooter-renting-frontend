import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface RideDetailHeaderProps {
  rideId: string;
  startTime?: string;
}

function formatStart(iso: string | undefined, locale: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(locale, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function RideDetailHeader({ rideId, startTime }: RideDetailHeaderProps) {
  const { t, i18n } = useTranslation('history');
  const locale = i18n.resolvedLanguage === 'pl' ? 'pl-PL' : 'en-US';
  const shortId = rideId.length > 8 ? rideId.slice(0, 8) : rideId;
  return (
    <div className="flex items-center gap-3 mb-6">
      <Link
        to="/history"
        className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
        aria-label={t('detail.backAria')}
      >
        <ArrowLeft size={18} className="text-slate-600" />
      </Link>
      <div>
        <h1 className="text-lg font-bold text-slate-900">{t('detail.headerTitle', { id: shortId })}</h1>
        <p className="text-xs text-slate-500">{formatStart(startTime, locale)}</p>
      </div>
    </div>
  );
}
