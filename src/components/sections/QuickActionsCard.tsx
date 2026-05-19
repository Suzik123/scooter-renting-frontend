import { Link } from 'react-router-dom';
import { MapPin, Clock, Zap, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ACTIONS = [
  { to: '/map', labelKey: 'quickActions.findScooter', icon: MapPin },
  { to: '/history', labelKey: 'quickActions.rideHistory', icon: Clock },
  { to: '/wallet', labelKey: 'quickActions.wallet', icon: Zap },
] as const;

export default function QuickActionsCard() {
  const { t } = useTranslation('dashboard');
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
      <h3 className="font-semibold text-slate-900 mb-3">{t('quickActions.title')}</h3>
      <div className="space-y-2">
        {ACTIONS.map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <action.icon size={18} className="text-slate-400" />
              <span className="text-sm font-medium text-slate-700">{t(action.labelKey)}</span>
            </div>
            <ChevronRight size={16} className="text-slate-300" />
          </Link>
        ))}
      </div>
    </div>
  );
}
