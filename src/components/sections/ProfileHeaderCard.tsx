import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogOut } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { useAuthStore } from '../../stores/authStore';
import { useRideHistoryStore } from '../../stores/rideHistoryStore';
import { toNum } from '../../lib/decimal';
import EditProfileModal from './EditProfileModal';

function getInitials(firstName?: string, lastName?: string): string {
  const f = (firstName ?? '').trim()[0] ?? '';
  const l = (lastName ?? '').trim()[0] ?? '';
  return (f + l).toUpperCase() || '?';
}

function formatMemberSince(iso?: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export default function ProfileHeaderCard() {
  const { t } = useTranslation(['profile', 'common']);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const rides = useRideHistoryStore((s) => s.rides);
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logout();
    } finally {
      navigate('/login', { replace: true });
    }
  };

  if (!user) return null;

  const initials = getInitials(user.first_name, user.last_name);
  const fullName = `${user.first_name} ${user.last_name}`.trim() || user.email;
  const isVerified = (user.status ?? '').toLowerCase() === 'active';
  const totalRides = rides.length;
  const totalDistanceM = rides.reduce((sum, r) => sum + (r.distance_m ?? 0), 0);
  const totalDistance =
    totalDistanceM >= 1000 ? `${(totalDistanceM / 1000).toFixed(1)} km` : `${totalDistanceM} m`;
  const totalSpent = rides.reduce((sum, r) => sum + toNum(r.total_cost), 0);
  const totalSpentLabel = `$${totalSpent.toFixed(2)}`;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 text-center">
      <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl font-bold text-white">{initials}</span>
      </div>
      <h2 className="text-lg font-bold text-slate-900 mb-1">{fullName}</h2>
      <p className="text-sm text-slate-500 mb-2">{user.email}</p>
      <Badge variant={isVerified ? 'success' : 'default'} className="mb-4">
        {isVerified ? 'Verified' : user.status || 'Pending'}
      </Badge>
      <p className="text-xs text-slate-400 mb-4">
        Member since {formatMemberSince(user.registration_date)}
      </p>

      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100">
        <div>
          <p className="text-lg font-bold text-slate-900">{totalRides}</p>
          <p className="text-xs text-slate-500">Rides</p>
        </div>
        <div>
          <p className="text-lg font-bold text-slate-900">{totalDistance}</p>
          <p className="text-xs text-slate-500">Distance</p>
        </div>
        <div>
          <p className="text-lg font-bold text-slate-900">{totalSpentLabel}</p>
          <p className="text-xs text-slate-500">Spent</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <Button fullWidth variant="outline" onClick={() => setEditOpen(true)}>
          {t('profile:editProfile.cta')}
        </Button>
        <Button
          fullWidth
          variant="ghost"
          className="text-red-500 hover:bg-red-50 hover:text-red-600"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          <LogOut size={16} className="mr-2" /> {loggingOut ? t('profile:loggingOut') : t('profile:logout')}
        </Button>
      </div>

      <EditProfileModal open={editOpen} onClose={() => setEditOpen(false)} />
    </div>
  );
}
