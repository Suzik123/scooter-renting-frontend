import { useNavigate } from 'react-router-dom';
import { Zap, Battery, MapPin, Navigation } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import ProgressBar from '../ui/ProgressBar';
import { useBestMatch, useScootersStore } from '../../stores/scootersStore';
import { useActiveRideStore } from '../../stores/activeRideStore';
import { useUIStore } from '../../stores/uiStore';

export default function BestMatchCard() {
  const bestMatch = useBestMatch();
  const scooters = useScootersStore((s) => s.scooters);
  const selectedScooterId = useScootersStore((s) => s.selectedScooterId);
  const startRide = useActiveRideStore((s) => s.startRide);
  const loading = useActiveRideStore((s) => s.loading);
  const showToast = useUIStore((s) => s.showToast);
  const navigate = useNavigate();

  if (!bestMatch) return null;

  const handleUnlock = async () => {
    const target =
      scooters.find((s) => s.id === selectedScooterId && s.status === 'available') ?? bestMatch;
    await startRide(target);
    showToast(`Unlocked ${target.name}`, 'success');
    navigate('/ride/active');
  };

  return (
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
        <ProgressBar value={bestMatch.battery} track="green" className="mb-3" />
        <Button fullWidth size="sm" onClick={handleUnlock} disabled={loading}>
          {loading ? 'Unlocking...' : 'Unlock & Ride'}
        </Button>
      </div>
    </div>
  );
}
