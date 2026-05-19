import { Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ActivePlanCard() {
  const { t } = useTranslation('profile');
  return (
    <div className="bg-gradient-to-br from-primary-light to-white rounded-xl border border-green-200 p-5">
      <div className="flex items-center gap-2 mb-2">
        <Zap size={16} className="text-primary" />
        <span className="text-xs font-medium text-primary">{t('activePlan.label')}</span>
      </div>
      <h4 className="font-semibold text-slate-900 mb-1">{t('activePlan.payAsYouGo')}</h4>
      <p className="text-xs text-slate-500">{t('activePlan.comingSoon')}</p>
    </div>
  );
}
