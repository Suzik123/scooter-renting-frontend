import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Zap, Bike, Star } from 'lucide-react';
import { rideHistory } from '../mock/data';

export default function RideDetailPage() {
  const { id } = useParams();
  const ride = rideHistory.find((r) => r.id === id) || rideHistory[0];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          to="/history"
          className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
          aria-label="Back to history"
        >
          <ArrowLeft size={18} className="text-slate-600" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-slate-900">Ride #{ride.id}</h1>
          <p className="text-xs text-slate-500">{ride.date}</p>
        </div>
      </div>

      {/* Route Map */}
      <div className="bg-dark-card rounded-2xl h-48 sm:h-56 relative overflow-hidden mb-6">
        {/* Dark map background */}
        <div className="absolute inset-0">
          {[20, 40, 60, 80].map((pos) => (
            <div key={`h-${pos}`} className="absolute left-0 right-0 border-t border-slate-700/30" style={{ top: `${pos}%` }} />
          ))}
          {[20, 40, 60, 80].map((pos) => (
            <div key={`v-${pos}`} className="absolute top-0 bottom-0 border-l border-slate-700/30" style={{ left: `${pos}%` }} />
          ))}
        </div>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d="M 20 35 C 30 35, 35 40, 40 50 S 55 65, 75 60"
            fill="none"
            stroke="#22C55E"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeDasharray="2,1"
          />
          <circle cx="20" cy="35" r="2.5" fill="#22C55E" />
          <circle cx="75" cy="60" r="2.5" fill="#EF4444" />
        </svg>
      </div>

      {/* Route Info */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-semibold text-slate-900">{ride.from} → {ride.to}</p>
            <p className="text-sm text-slate-500">{ride.scooterName} ({ride.scooterId})</p>
          </div>
          <span className="text-xl font-bold text-slate-900">{ride.cost}</span>
        </div>

        {/* Timeline */}
        <div className="flex items-start gap-3 mb-2">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <div className="w-0.5 h-8 bg-primary/30" />
            <div className="w-3 h-3 rounded-full bg-red-400" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-900">{ride.from}</p>
              <p className="text-xs text-slate-500">Start point</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">{ride.to}</p>
              <p className="text-xs text-slate-500">End point</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 text-center">
          <Clock size={18} className="text-primary mx-auto mb-2" />
          <p className="text-xs text-slate-500 mb-0.5">Duration</p>
          <p className="font-semibold text-slate-900">{ride.duration}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 text-center">
          <MapPin size={18} className="text-primary mx-auto mb-2" />
          <p className="text-xs text-slate-500 mb-0.5">Distance</p>
          <p className="font-semibold text-slate-900">{ride.distance}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 text-center">
          <Zap size={18} className="text-primary mx-auto mb-2" />
          <p className="text-xs text-slate-500 mb-0.5">Avg Speed</p>
          <p className="font-semibold text-slate-900">{ride.avgSpeed}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 text-center">
          <Bike size={18} className="text-primary mx-auto mb-2" />
          <p className="text-xs text-slate-500 mb-0.5">Scooter</p>
          <p className="font-semibold text-slate-900">{ride.scooterName}</p>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 mb-4">
        <h3 className="font-semibold text-slate-900 mb-4">Cost Breakdown</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Unlock fee</span>
            <span className="text-slate-900">$1.00</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Ride time ({ride.duration})</span>
            <span className="text-slate-900">{ride.cost.replace('$', '$').replace(/\d+\.\d+/, (v) => (parseFloat(v) - 1).toFixed(2))}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Weekly Pass discount</span>
            <span className="text-green-600">-$0.00</span>
          </div>
          <div className="border-t border-slate-100 pt-3 flex justify-between">
            <span className="font-semibold text-slate-900">Total Charged</span>
            <span className="font-bold text-slate-900">{ride.cost}</span>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
        <h3 className="font-semibold text-slate-900 mb-3">Your Rating</h3>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={24}
              className={i < ride.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
