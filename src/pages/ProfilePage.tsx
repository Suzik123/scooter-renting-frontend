import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ProfileHeaderCard from '../components/sections/ProfileHeaderCard';
import ProfileEcoImpact from '../components/sections/ProfileEcoImpact';
import ProfileFavoriteScooter from '../components/sections/ProfileFavoriteScooter';
import LocaleSwitcher from '../components/sections/LocaleSwitcher';
import ThemeToggle from '../components/sections/ThemeToggle';
import { useAuthStore } from '../stores/authStore';
import { useRideHistoryStore } from '../stores/rideHistoryStore';

export default function ProfilePage() {
  const { t } = useTranslation(['profile', 'common']);
  const userId = useAuthStore((s) => s.user?.user_id ?? null);
  const loadHistory = useRideHistoryStore((s) => s.loadHistory);
  const ridesLoaded = useRideHistoryStore((s) => s.rides.length > 0);

  useEffect(() => {
    if (userId && !ridesLoaded) loadHistory(userId, { limit: 50 });
  }, [userId, ridesLoaded, loadHistory]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] mb-6">
        {t('profile:title')}
      </h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ProfileHeaderCard />
          <ProfileEcoImpact />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-5 shadow-sm">
            <h3 className="font-semibold text-[var(--color-text-primary)] mb-3">
              {t('profile:settings.preferences')}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-sm text-[var(--color-text-secondary)]">
                  {t('common:theme.label')}
                </span>
                <ThemeToggle />
              </div>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-sm text-[var(--color-text-secondary)]">
                  {t('common:language.label')}
                </span>
                <LocaleSwitcher />
              </div>
            </div>
          </div>
          <ProfileFavoriteScooter />
        </div>
      </div>
    </div>
  );
}
