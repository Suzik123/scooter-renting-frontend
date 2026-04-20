import MapSearchBar from '../components/sections/MapSearchBar';
import MapFilterPills from '../components/sections/MapFilterPills';
import BestMatchCard from '../components/sections/BestMatchCard';
import ScooterList from '../components/sections/ScooterList';
import MapCanvas from '../components/sections/MapCanvas';

export default function MapPage() {
  return (
    <div className="h-[calc(100vh-4rem)] lg:h-screen flex flex-col lg:flex-row">
      <div className="lg:w-80 lg:border-r lg:border-slate-200 bg-white flex flex-col z-10 order-2 lg:order-1">
        <div className="p-4 border-b border-slate-100">
          <MapSearchBar />
          <MapFilterPills />
        </div>
        <BestMatchCard />
        <ScooterList />
      </div>
      <MapCanvas />
    </div>
  );
}
