import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MapPin, Wallet, Clock, User, Settings, MessageCircle } from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/map', icon: MapPin, label: 'Find Scooter' },
  { to: '/wallet', icon: Wallet, label: 'Wallet' },
  { to: '/history', icon: Clock, label: 'History' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-56 h-screen bg-white border-r border-slate-200 fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-6">
        <div className="w-3 h-3 rounded-full bg-primary" />
        <span className="text-lg font-bold text-slate-900">UniScoot</span>
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
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
              )
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}

        <div className="pt-4">
          <NavLink
            to="/profile"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Settings size={20} />
            Settings
          </NavLink>
        </div>
      </nav>

      {/* Help Card */}
      <div className="mx-3 mb-4 p-4 bg-primary-light rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <MessageCircle size={18} className="text-primary" />
          <span className="text-sm font-semibold text-slate-900">Need Help?</span>
        </div>
        <p className="text-xs text-slate-600 mb-3">Our support team is here 24/7</p>
        <button className="w-full bg-primary text-white text-xs font-medium py-2 rounded-lg hover:bg-primary-dark transition-colors cursor-pointer">
          Start Chat
        </button>
      </div>
    </aside>
  );
}
