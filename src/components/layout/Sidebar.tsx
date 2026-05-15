import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MapPin, Wallet, Clock, User, Settings, MessageCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';
import LocaleSwitcher from '../sections/LocaleSwitcher';
import ThemeToggle from '../sections/ThemeToggle';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, key: 'nav.dashboard' as const },
  { to: '/map', icon: MapPin, key: 'nav.map' as const },
  { to: '/wallet', icon: Wallet, key: 'nav.wallet' as const },
  { to: '/history', icon: Clock, key: 'nav.history' as const },
  { to: '/profile', icon: User, key: 'nav.profile' as const },
];

export default function Sidebar() {
  const { t } = useTranslation('common');
  const isAdmin = useAuthStore((s) => s.user?.role === 'admin');

  return (
    <aside className="hidden lg:flex flex-col w-56 h-screen bg-[var(--color-surface)] border-r border-[var(--color-border)] fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-6">
        <div className="w-3 h-3 rounded-full bg-primary" />
        <span className="text-lg font-bold text-[var(--color-text-primary)]">{t('appName')}</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-text-primary)]',
              )
            }
          >
            <item.icon size={20} />
            {t(item.key)}
          </NavLink>
        ))}

        {isAdmin && (
          <NavLink
            to="/admin/payments"
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-text-primary)]',
              )
            }
          >
            <Settings size={20} />
            {t('nav.admin')}
          </NavLink>
        )}

        <div className="pt-4">
          <NavLink
            to="/profile"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <Settings size={20} />
            {t('nav.settings')}
          </NavLink>
        </div>
      </nav>

      <div className="px-3 mb-3 space-y-2">
        <ThemeToggle compact />
        <LocaleSwitcher />
      </div>

      {/* Help Card */}
      <div className="mx-3 mb-4 p-4 bg-primary-light rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <MessageCircle size={18} className="text-primary" />
          <span className="text-sm font-semibold text-slate-900">Need Help?</span>
        </div>
        <p className="text-xs text-slate-700 mb-3">Our support team is here 24/7</p>
        <button
          type="button"
          className="w-full bg-primary text-white text-xs font-medium py-2 rounded-lg hover:bg-primary-dark transition-colors cursor-pointer"
        >
          Start Chat
        </button>
      </div>
    </aside>
  );
}
