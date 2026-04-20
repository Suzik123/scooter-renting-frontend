import { Link } from 'react-router-dom';
import { MapPin, Clock, Zap, ChevronRight } from 'lucide-react';

const ACTIONS = [
  { to: '/map', label: 'Find a Scooter', icon: MapPin },
  { to: '/history', label: 'Ride History', icon: Clock },
  { to: '/wallet', label: 'Top Up Wallet', icon: Zap },
];

export default function QuickActionsCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
      <h3 className="font-semibold text-slate-900 mb-3">Quick Actions</h3>
      <div className="space-y-2">
        {ACTIONS.map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <action.icon size={18} className="text-slate-400" />
              <span className="text-sm font-medium text-slate-700">{action.label}</span>
            </div>
            <ChevronRight size={16} className="text-slate-300" />
          </Link>
        ))}
      </div>
    </div>
  );
}
