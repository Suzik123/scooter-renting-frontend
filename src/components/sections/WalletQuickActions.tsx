import { Plus, Send, Gift, RefreshCw } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';

export default function WalletQuickActions() {
  const openTopUp = useUIStore((s) => s.openTopUp);

  const actions = [
    { icon: Plus, label: 'Top Up', onClick: openTopUp },
    { icon: Send, label: 'Send' },
    { icon: Gift, label: 'Redeem' },
    { icon: RefreshCw, label: 'Auto Top' },
  ];

  return (
    <div className="hidden lg:grid grid-cols-4 gap-3">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={action.onClick}
          className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
            <action.icon size={18} className="text-primary" />
          </div>
          <span className="text-xs font-medium text-slate-700">{action.label}</span>
        </button>
      ))}
    </div>
  );
}
