import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import Button from '../ui/Button';
import { useWalletStore } from '../../stores/walletStore';
import { useUIStore } from '../../stores/uiStore';

interface WalletBalanceCardProps {
  variant?: 'compact' | 'full';
}

export default function WalletBalanceCard({ variant = 'compact' }: WalletBalanceCardProps) {
  const balance = useWalletStore((s) => s.balance);
  const openTopUp = useUIStore((s) => s.openTopUp);

  if (variant === 'full') {
    return (
      <div className="bg-dark-card rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <p className="text-sm text-slate-400 mb-1">Available Balance</p>
          <p className="text-4xl font-bold mb-1">${balance.toFixed(2)}</p>
          <p className="text-xs text-slate-500 mb-6 flex items-center gap-1">
            <Shield size={12} /> 256-bit encrypted
          </p>
          <div className="flex gap-3">
            <Button size="md" onClick={openTopUp}>Top Up</Button>
            <Button
              size="md"
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Withdraw
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-card rounded-xl p-5 text-white">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-400">Wallet Balance</p>
        <Link to="/wallet" className="text-xs text-primary hover:underline">Manage</Link>
      </div>
      <p className="text-3xl font-bold mb-4">${balance.toFixed(2)}</p>
      <Button size="sm" fullWidth onClick={openTopUp}>Top Up</Button>
    </div>
  );
}
