import { Link } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

function getInitials(firstName?: string, lastName?: string): string {
  const f = (firstName ?? '').trim()[0] ?? '';
  const l = (lastName ?? '').trim()[0] ?? '';
  return (f + l).toUpperCase() || '?';
}

export default function DashboardGreeting() {
  const user = useAuthStore((s) => s.user);
  const firstName = user?.first_name?.trim() || 'there';
  const initials = user ? getInitials(user.first_name, user.last_name) : '?';

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Good morning, {firstName}!
        </h1>
        <p className="text-sm text-slate-500">Ready for your next ride?</p>
      </div>
      <Link
        to="/profile"
        className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm"
        aria-label="Open profile"
      >
        {initials}
      </Link>
    </div>
  );
}
