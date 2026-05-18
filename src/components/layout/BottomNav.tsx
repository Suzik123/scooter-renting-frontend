import { NavLink } from 'react-router-dom';
import { Home, MapPin, Wallet, Clock, User } from 'lucide-react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';

const tabs = [
  { to: '/dashboard', icon: Home, key: 'nav.dashboard' as const },
  { to: '/map', icon: MapPin, key: 'nav.map' as const },
  { to: '/wallet', icon: Wallet, key: 'nav.wallet' as const },
  { to: '/history', icon: Clock, key: 'nav.history' as const },
  { to: '/profile', icon: User, key: 'nav.profile' as const },
];

export default function BottomNav() {
  const { t } = useTranslation('common');
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-bg-elevated)] border-t border-[var(--color-border)] shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around h-16 px-2 pb-[env(safe-area-inset-bottom)]">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              clsx(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs font-medium transition-colors',
                isActive ? 'text-primary' : 'text-[var(--color-text-faint)]',
              )
            }
          >
            {({ isActive }) => (
              <>
                <tab.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span>{t(tab.key)}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
