import { Link } from 'react-router-dom';
import { Bike, MapPin, Clock, Leaf, ArrowRight, Zap, Star, ChevronRight, DollarSign } from 'lucide-react';
import { currentUser, rideHistory, userStats, scooters } from '../mock/data';
import MapPlaceholder from '../components/MapPlaceholder';
import StatCard from '../components/ui/StatCard';
import Button from '../components/ui/Button';

export default function DashboardPage() {
  const lastRide = rideHistory[0];
  const availableScooters = scooters.filter((s) => s.status === 'available');

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl">
      {/* Greeting */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Good morning, {currentUser.name.split(' ')[0]}!
          </h1>
          <p className="text-sm text-slate-500">Ready for your next ride?</p>
        </div>
        <Link to="/profile" className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm">
          {currentUser.initials}
        </Link>
      </div>

      {/* Start Ride Banner */}
      <Link
        to="/map"
        className="block bg-gradient-to-r from-primary to-emerald-600 rounded-2xl p-5 sm:p-6 mb-6 text-white hover:shadow-lg transition-shadow"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/80 mb-1">Ready to ride?</p>
            <h2 className="text-lg sm:text-xl font-bold mb-1">Start a Ride</h2>
            <p className="text-sm text-white/80">
              {availableScooters.length} scooters nearby
            </p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Bike size={24} />
          </div>
        </div>
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Map Preview */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between p-4 pb-0">
              <h3 className="font-semibold text-slate-900">Nearby Scooters</h3>
              <Link to="/map" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
                View Map <ArrowRight size={14} />
              </Link>
            </div>
            <div className="p-4">
              <MapPlaceholder className="h-48 sm:h-56" />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard icon={<Bike size={18} />} label="Total Rides" value={String(userStats.totalRides)} />
            <StatCard icon={<Clock size={18} />} label="Time Riding" value="4.2h" />
            <StatCard icon={<DollarSign size={18} />} label="Total Spent" value={userStats.totalSpent} />
            <StatCard icon={<Leaf size={18} />} label="CO2 Saved" value={userStats.co2Saved} />
          </div>

          {/* Last Ride */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Last Ride</h3>
              <Link to="/history" className="text-sm text-primary font-medium hover:underline">
                View All
              </Link>
            </div>
            <Link to={`/history/${lastRide.id}`} className="block hover:bg-slate-50 rounded-lg -mx-2 px-2 py-2 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center flex-shrink-0">
                  <Bike size={20} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 text-sm">{lastRide.from} → {lastRide.to}</p>
                  <p className="text-xs text-slate-500">{lastRide.scooterName} · {lastRide.duration} · {lastRide.distance}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-slate-900 text-sm">{lastRide.cost}</p>
                  <div className="flex gap-0.5 justify-end">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={10} className={i < lastRide.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'} />
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Sidebar content (desktop) */}
        <div className="space-y-6">
          {/* Wallet Card */}
          <div className="bg-dark-card rounded-xl p-5 text-white">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-400">Wallet Balance</p>
              <Link to="/wallet" className="text-xs text-primary hover:underline">Manage</Link>
            </div>
            <p className="text-3xl font-bold mb-4">$24.50</p>
            <Link to="/wallet">
              <Button size="sm" fullWidth>Top Up</Button>
            </Link>
          </div>

          {/* Weekly Pass */}
          <div className="bg-gradient-to-br from-primary-light to-white rounded-xl border border-green-200 p-5">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className="text-primary" />
              <span className="text-xs font-medium text-primary">Active Plan</span>
            </div>
            <h4 className="font-semibold text-slate-900 mb-1">Weekly Pass</h4>
            <p className="text-xs text-slate-500 mb-3">38 min remaining today</p>
            <div className="w-full bg-green-200 rounded-full h-2">
              <div className="bg-primary rounded-full h-2 w-[63%]" />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <h3 className="font-semibold text-slate-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { to: '/map', label: 'Find a Scooter', icon: MapPin },
                { to: '/history', label: 'Ride History', icon: Clock },
                { to: '/wallet', label: 'Top Up Wallet', icon: Zap },
              ].map((action) => (
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
        </div>
      </div>
    </div>
  );
}
