import { Link } from 'react-router-dom';
import { Battery, MapPin, Clock, Gauge, Navigation } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import MapPlaceholder from '../components/MapPlaceholder';

export default function ActiveRidePage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Ride Info */}
        <div className="space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <Badge variant="success" className="animate-pulse text-sm px-4 py-1.5">
              RIDE ACTIVE
            </Badge>
            <span className="text-xs text-slate-500">Scooter SC-1042</span>
          </div>

          {/* Timer */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 text-center">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Ride Duration</p>
            <p className="text-5xl sm:text-6xl font-bold text-slate-900 font-mono tracking-wider mb-2">
              00:08:24
            </p>
            <p className="text-sm text-slate-500">
              Current Cost: <span className="text-lg font-bold text-primary">$1.59</span>
            </p>
          </div>

          {/* Scooter Info */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-slate-900">Spark X1</h3>
                <p className="text-xs text-slate-500">X1 Pro · SC-1042</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">85%</p>
                <p className="text-xs text-slate-500">Battery</p>
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mb-4">
              <div className="bg-primary rounded-full h-2 w-[85%]" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                  <MapPin size={18} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Distance</p>
                  <p className="text-sm font-semibold text-slate-900">1.8 km</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Clock size={18} className="text-purple-500" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">ETA</p>
                  <p className="text-sm font-semibold text-slate-900">~5 min</p>
                </div>
              </div>
            </div>
          </div>

          {/* End Ride Button */}
          <Link to="/ride/complete">
            <Button variant="danger" fullWidth size="lg" className="text-base">
              End Ride
            </Button>
          </Link>
        </div>

        {/* Map Area */}
        <div className="relative">
          <MapPlaceholder
            className="h-64 lg:h-full min-h-[300px]"
            showRoute
            scooterDots={[
              { top: '50%', left: '48%' },
            ]}
          />

          {/* Speed Widget */}
          <div className="absolute bottom-4 right-4 bg-white rounded-xl shadow-lg p-3 text-center min-w-[80px]">
            <Gauge size={18} className="text-primary mx-auto mb-1" />
            <p className="text-xl font-bold text-slate-900">12</p>
            <p className="text-xs text-slate-500">km/h</p>
          </div>

          {/* Current location indicator */}
          <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md px-3 py-2 flex items-center gap-2">
            <Navigation size={14} className="text-primary" />
            <span className="text-xs font-medium text-slate-700">Central Park Area</span>
          </div>
        </div>
      </div>
    </div>
  );
}
