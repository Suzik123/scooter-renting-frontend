import { Link } from 'react-router-dom';
import { CheckCircle, Clock, Gauge, MapPin, Leaf, Star, Share2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useState } from 'react';

export default function RideCompletePage() {
  const [rating, setRating] = useState(4);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Map */}
        <div className="bg-dark-card rounded-2xl h-64 lg:h-full min-h-[300px] relative overflow-hidden">
          {/* Dark map bg */}
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
              d="M 25 30 C 35 30, 40 40, 45 50 S 60 65, 72 60"
              fill="none"
              stroke="#22C55E"
              strokeWidth="0.8"
              strokeLinecap="round"
            />
            {/* Start marker */}
            <circle cx="25" cy="30" r="3" fill="#22C55E" />
            <circle cx="25" cy="30" r="1.5" fill="white" />
            {/* End marker */}
            <circle cx="72" cy="60" r="3" fill="#EF4444" />
            <circle cx="72" cy="60" r="1.5" fill="white" />
          </svg>

          {/* Route labels */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5">
            <p className="text-xs font-medium text-slate-700">Central Park → Downtown Hub</p>
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center lg:text-left">
            <CheckCircle size={48} className="text-primary mx-auto lg:mx-0 mb-3" />
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Ride Complete!</h1>
            <p className="text-sm text-slate-500">Great ride! Here's your summary.</p>
          </div>

          {/* Total Cost */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Total Cost</p>
            <p className="text-4xl font-bold text-slate-900 mb-2">$3.42</p>
            <Badge variant="success">Paid via Wallet</Badge>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-3 text-center">
              <Clock size={16} className="text-primary mx-auto mb-1" />
              <p className="text-xs text-slate-500">Duration</p>
              <p className="font-semibold text-sm text-slate-900">12 min</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-3 text-center">
              <Gauge size={16} className="text-primary mx-auto mb-1" />
              <p className="text-xs text-slate-500">Avg Speed</p>
              <p className="font-semibold text-sm text-slate-900">12 km/h</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-3 text-center">
              <MapPin size={16} className="text-primary mx-auto mb-1" />
              <p className="text-xs text-slate-500">Distance</p>
              <p className="font-semibold text-sm text-slate-900">2.1 km</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-3 text-center">
              <Leaf size={16} className="text-primary mx-auto mb-1" />
              <p className="text-xs text-slate-500">CO2 Saved</p>
              <p className="font-semibold text-sm text-slate-900">0.5 kg</p>
            </div>
          </div>

          {/* Rating */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <h3 className="font-semibold text-slate-900 mb-3 text-center lg:text-left">Rate your ride</h3>
            <div className="flex gap-1 justify-center lg:justify-start">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setRating(i + 1)}
                  className="cursor-pointer p-0.5"
                  aria-label={`Rate ${i + 1} stars`}
                >
                  <Star
                    size={28}
                    className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link to="/map">
              <Button fullWidth size="lg">
                Done - Back to Map
              </Button>
            </Link>
            <Button fullWidth size="lg" variant="outline" className="flex items-center justify-center gap-2">
              <Share2 size={18} /> Share Ride
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
