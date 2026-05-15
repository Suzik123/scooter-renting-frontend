import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

interface ProtectedRouteProps {
  requiresAdmin?: boolean;
}

/**
 * Gates child routes behind an authenticated session.
 * Waits for the persisted store to hydrate before redirecting so a logged-in
 * user reloading on a protected route is not flashed through `/login`.
 */
export default function ProtectedRoute({ requiresAdmin = false }: ProtectedRouteProps) {
  const location = useLocation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const role = useAuthStore((s) => s.user?.role ?? null);

  const [hydrated, setHydrated] = useState(() => useAuthStore.persist.hasHydrated());
  useEffect(() => {
    if (hydrated) return;
    const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true));
    return unsub;
  }, [hydrated]);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <div
          role="status"
          aria-label="Loading"
          className="h-6 w-6 rounded-full border-2 border-[var(--color-border)] border-t-primary animate-spin"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requiresAdmin && role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
