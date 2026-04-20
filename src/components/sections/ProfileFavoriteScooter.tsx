import { Bike } from 'lucide-react';
import { userStats } from '../../mock/data';

export default function ProfileFavoriteScooter() {
  return (
    <div className="lg:hidden bg-white rounded-xl shadow-sm border border-slate-100 p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center">
          <Bike size={20} className="text-primary" />
        </div>
        <div>
          <p className="text-xs text-slate-500">Favorite Scooter</p>
          <p className="font-semibold text-sm text-slate-900">{userStats.favoriteScooter}</p>
        </div>
      </div>
    </div>
  );
}
