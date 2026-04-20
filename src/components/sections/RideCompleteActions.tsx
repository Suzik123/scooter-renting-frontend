import { Link } from 'react-router-dom';
import { Share2 } from 'lucide-react';
import Button from '../ui/Button';

export default function RideCompleteActions() {
  return (
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
  );
}
