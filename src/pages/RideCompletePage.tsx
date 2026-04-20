import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, Gauge, MapPin, Leaf, Share2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import RatingStars from '../components/ui/RatingStars';
import RideMapCard from '../components/sections/RideMapCard';
import { useLastRide, useRideHistoryStore } from '../stores/rideHistoryStore';

export default function RideCompletePage() {
  const lastRide = useLastRide();
  const rateRide = useRideHistoryStore((s) => s.rateRide);
  const navigate = useNavigate();

  if (!lastRide) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto">
        <p className="text-sm text-slate-500">No completed ride to show.</p>
        <Link to="/map" className="text-sm text-primary hover:underline">Back to map</Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-6">
        <RideMapCard variant="complete" routeLabel={`${lastRide.from} → ${lastRide.to}`} />

        <div className="space-y-6">
          <div className="text-center lg:text-left">
            <CheckCircle size={48} className="text-primary mx-auto lg:mx-0 mb-3" />
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Ride Complete!</h1>
            <p className="text-sm text-slate-500">Great ride! Here's your summary.</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Total Cost</p>
            <p className="text-4xl font-bold text-slate-900 mb-2">{lastRide.cost}</p>
            <Badge variant="success">Paid via Wallet</Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-3 text-center">
              <Clock size={16} className="text-primary mx-auto mb-1" />
              <p className="text-xs text-slate-500">Duration</p>
              <p className="font-semibold text-sm text-slate-900">{lastRide.duration}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-3 text-center">
              <Gauge size={16} className="text-primary mx-auto mb-1" />
              <p className="text-xs text-slate-500">Avg Speed</p>
              <p className="font-semibold text-sm text-slate-900">{lastRide.avgSpeed}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-3 text-center">
              <MapPin size={16} className="text-primary mx-auto mb-1" />
              <p className="text-xs text-slate-500">Distance</p>
              <p className="font-semibold text-sm text-slate-900">{lastRide.distance}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-3 text-center">
              <Leaf size={16} className="text-primary mx-auto mb-1" />
              <p className="text-xs text-slate-500">CO2 Saved</p>
              <p className="font-semibold text-sm text-slate-900">{lastRide.co2Saved}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <h3 className="font-semibold text-slate-900 mb-3 text-center lg:text-left">Rate your ride</h3>
            <div className="flex justify-center lg:justify-start">
              <RatingStars
                value={lastRide.rating}
                readonly={false}
                size={28}
                onChange={(v) => {
                  rateRide(lastRide.id, v);
                  navigate('/history');
                }}
              />
            </div>
          </div>

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
