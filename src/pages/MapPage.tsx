import { useState } from 'react';
import { Search, Filter, Battery, MapPin, Zap, Navigation } from 'lucide-react';
import { scooters } from '../mock/data';
import MapPlaceholder from '../components/MapPlaceholder';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';

const filters = ['All', 'Nearest', 'Best Battery', 'Cheapest'];

export default function MapPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedScooter, setSelectedScooter] = useState(scooters[0].id);
  const available = scooters.filter((s) => s.status === 'available');
  const bestMatch = scooters[0];

  return (
    <div className="h-[calc(100vh-4rem)] lg:h-screen flex flex-col lg:flex-row">
      {/* Panel */}
      <div className="lg:w-80 lg:border-r lg:border-slate-200 bg-white flex flex-col z-10 order-2 lg:order-1">
        {/* Search */}
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search location..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer" aria-label="Filter">
              <Filter size={16} />
            </button>
          </div>
          {/* Filter pills */}
          <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={clsx(
                  'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer',
                  activeFilter === f
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Best Match */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center gap-1.5 mb-2">
            <Zap size={14} className="text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wide">Best Match</span>
          </div>
          <div className="bg-primary-light rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-slate-900">{bestMatch.name}</h4>
              <Badge variant="success">Available</Badge>
            </div>
            <p className="text-xs text-slate-500 mb-3">ID: {bestMatch.id}</p>
            <div className="flex items-center gap-4 mb-3 text-xs text-slate-600">
              <span className="flex items-center gap-1"><Battery size={14} /> {bestMatch.battery}%</span>
              <span className="flex items-center gap-1"><MapPin size={14} /> {bestMatch.distance}</span>
              <span className="flex items-center gap-1"><Navigation size={14} /> {bestMatch.price}</span>
            </div>
            <div className="w-full bg-green-200 rounded-full h-1.5 mb-3">
              <div className="bg-primary rounded-full h-1.5" style={{ width: `${bestMatch.battery}%` }} />
            </div>
            <Link to="/ride/active">
              <Button fullWidth size="sm">Unlock & Ride</Button>
            </Link>
          </div>
        </div>

        {/* Scooter List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-2">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{available.length} scooters nearby</p>
            {available.map((scooter) => (
              <button
                key={scooter.id}
                onClick={() => setSelectedScooter(scooter.id)}
                className={clsx(
                  'w-full text-left p-3 rounded-xl border transition-colors cursor-pointer',
                  selectedScooter === scooter.id
                    ? 'border-primary bg-primary-light'
                    : 'border-slate-100 bg-white hover:bg-slate-50',
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-slate-900">{scooter.name}</span>
                  <span className="text-xs text-slate-500">{scooter.price}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Battery size={12} /> {scooter.battery}%</span>
                  <span className="flex items-center gap-1"><MapPin size={12} /> {scooter.distance}</span>
                  <span className="text-slate-400">ID: {scooter.id}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1 mt-2">
                  <div
                    className={clsx('rounded-full h-1', scooter.battery > 50 ? 'bg-primary' : scooter.battery > 20 ? 'bg-yellow-400' : 'bg-red-400')}
                    style={{ width: `${scooter.battery}%` }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map area */}
      <div className="flex-1 relative order-1 lg:order-2 min-h-[200px] lg:min-h-0">
        <MapPlaceholder
          className="w-full h-full rounded-none"
          scooterDots={[
            { top: '25%', left: '35%' },
            { top: '40%', left: '55%' },
            { top: '30%', left: '70%' },
            { top: '60%', left: '30%' },
            { top: '50%', left: '48%' },
            { top: '70%', left: '65%' },
            { top: '20%', left: '50%' },
          ]}
        />
        {/* Recenter button */}
        <button
          className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"
          aria-label="Re-center map"
        >
          <Navigation size={18} className="text-slate-600" />
        </button>
      </div>
    </div>
  );
}
