import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import MapPlaceholder from '../MapPlaceholder';

export default function NearbyScootersPreview() {
  return (
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
  );
}
