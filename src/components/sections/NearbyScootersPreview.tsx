import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import MapPlaceholder from '../MapPlaceholder';
import SectionHeader from '../ui/SectionHeader';

export default function NearbyScootersPreview() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <SectionHeader
        title="Nearby Scooters"
        className="p-4 pb-0"
        action={
          <Link to="/map" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
            View Map <ArrowRight size={14} />
          </Link>
        }
      />
      <div className="p-4">
        <MapPlaceholder className="h-48 sm:h-56" />
      </div>
    </div>
  );
}
