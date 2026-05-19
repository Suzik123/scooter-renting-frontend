import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import HistoryStatsGrid from '../components/sections/HistoryStatsGrid';
import HistoryFilterPills from '../components/sections/HistoryFilterPills';
import HistoryRidesTable from '../components/sections/HistoryRidesTable';
import HistoryRidesMobileList from '../components/sections/HistoryRidesMobileList';
import { useRideHistoryStore } from '../stores/rideHistoryStore';
import { useAuthStore } from '../stores/authStore';

export default function HistoryPage() {
  const { t } = useTranslation('history');
  const userId = useAuthStore((s) => s.user?.user_id ?? null);
  const loadHistory = useRideHistoryStore((s) => s.loadHistory);
  const error = useRideHistoryStore((s) => s.error);

  useEffect(() => {
    if (userId) loadHistory(userId, { limit: 50 });
  }, [userId, loadHistory]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl">
      <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] mb-6">{t('title')}</h1>
      {error && (
        <p className="text-sm text-red-600 mb-4" role="alert">{error}</p>
      )}
      <HistoryStatsGrid />
      <HistoryFilterPills className="lg:hidden mb-4" />
      <HistoryRidesTable />
      <HistoryRidesMobileList />
    </div>
  );
}
