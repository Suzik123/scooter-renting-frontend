import { ArrowUpRight, ArrowDownLeft, CreditCard, Smartphone, Plus, Shield, Gift, Send, RefreshCw } from 'lucide-react';
import { transactions, paymentMethods } from '../mock/data';
import Button from '../components/ui/Button';
import { clsx } from 'clsx';

const spendingData = [
  { label: 'Mon', value: 3.2, max: 8 },
  { label: 'Tue', value: 5.1, max: 8 },
  { label: 'Wed', value: 2.0, max: 8 },
  { label: 'Thu', value: 7.5, max: 8 },
  { label: 'Fri', value: 4.8, max: 8 },
  { label: 'Sat', value: 6.2, max: 8 },
  { label: 'Sun', value: 1.5, max: 8 },
];

const quickActions = [
  { icon: Plus, label: 'Top Up' },
  { icon: Send, label: 'Send' },
  { icon: Gift, label: 'Redeem' },
  { icon: RefreshCw, label: 'Auto Top' },
];

export default function WalletPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">Wallet</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Balance Card */}
          <div className="bg-dark-card rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <p className="text-sm text-slate-400 mb-1">Available Balance</p>
              <p className="text-4xl font-bold mb-1">$24.50</p>
              <p className="text-xs text-slate-500 mb-6 flex items-center gap-1">
                <Shield size={12} /> 256-bit encrypted
              </p>
              <div className="flex gap-3">
                <Button size="md">Top Up</Button>
                <Button size="md" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white">
                  Withdraw
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Actions - desktop */}
          <div className="hidden lg:grid grid-cols-4 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center">
                  <action.icon size={18} className="text-primary" />
                </div>
                <span className="text-xs font-medium text-slate-700">{action.label}</span>
              </button>
            ))}
          </div>

          {/* Spending Chart - desktop */}
          <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">This Week</h3>
              <span className="text-sm text-slate-500">$30.30 total</span>
            </div>
            <div className="flex items-end gap-3 h-32">
              {spendingData.map((day) => (
                <div key={day.label} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-slate-100 rounded-t-md relative" style={{ height: '100%' }}>
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-md transition-all"
                      style={{ height: `${(day.value / day.max) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500">{day.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Promo code - mobile */}
          <div className="lg:hidden bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <h3 className="font-semibold text-slate-900 mb-3">Promo Code</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter promo code"
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button size="md">Apply</Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Methods */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Payment Methods</h3>
              <button className="text-sm text-primary font-medium cursor-pointer hover:underline">Add</button>
            </div>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={clsx(
                    'flex items-center gap-3 p-3 rounded-xl border transition-colors',
                    method.isDefault ? 'border-primary bg-primary-light' : 'border-slate-100',
                  )}
                >
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    {method.type === 'apple-pay' ? (
                      <Smartphone size={18} className="text-slate-600" />
                    ) : (
                      <CreditCard size={18} className="text-slate-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{method.label}</p>
                    {method.last4 && <p className="text-xs text-slate-500">**** {method.last4}</p>}
                  </div>
                  {method.isDefault && (
                    <span className="text-xs text-primary font-medium">Default</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Transactions */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Recent Transactions</h3>
              <button className="text-sm text-primary font-medium cursor-pointer hover:underline">See All</button>
            </div>
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center gap-3">
                  <div className={clsx(
                    'w-9 h-9 rounded-full flex items-center justify-center',
                    tx.positive ? 'bg-green-100' : 'bg-red-50',
                  )}>
                    {tx.positive ? (
                      <ArrowDownLeft size={16} className="text-green-600" />
                    ) : (
                      <ArrowUpRight size={16} className="text-red-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{tx.description}</p>
                    <p className="text-xs text-slate-500">{tx.date}</p>
                  </div>
                  <span className={clsx('text-sm font-semibold', tx.positive ? 'text-green-600' : 'text-slate-900')}>
                    {tx.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
