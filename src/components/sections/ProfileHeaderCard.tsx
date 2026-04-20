import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { useAuthStore } from '../../stores/authStore';
import { currentUser as fallbackUser, userStats } from '../../mock/data';

export default function ProfileHeaderCard() {
  const storeUser = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const user = storeUser ?? fallbackUser;

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 text-center">
      <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl font-bold text-white">{user.initials}</span>
      </div>
      <h2 className="text-lg font-bold text-slate-900 mb-1">{user.name}</h2>
      <p className="text-sm text-slate-500 mb-2">{user.email}</p>
      <Badge variant="success" className="mb-4">
        {user.verified ? 'Verified' : 'Unverified'}
      </Badge>
      <p className="text-xs text-slate-400 mb-4">Member since {user.memberSince}</p>

      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100">
        <div>
          <p className="text-lg font-bold text-slate-900">{userStats.totalRides}</p>
          <p className="text-xs text-slate-500">Rides</p>
        </div>
        <div>
          <p className="text-lg font-bold text-slate-900">{userStats.totalDistance}</p>
          <p className="text-xs text-slate-500">Distance</p>
        </div>
        <div>
          <p className="text-lg font-bold text-slate-900">{userStats.totalSpent}</p>
          <p className="text-xs text-slate-500">Spent</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <Button fullWidth variant="outline">Edit Profile</Button>
        <Button
          fullWidth
          variant="ghost"
          className="text-red-500 hover:bg-red-50 hover:text-red-600"
          onClick={handleLogout}
        >
          <LogOut size={16} className="mr-2" /> Log Out
        </Button>
      </div>
    </div>
  );
}
