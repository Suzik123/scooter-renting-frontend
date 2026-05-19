import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import RouteFallback from './components/ui/RouteFallback';
import { useTheme } from './hooks/useTheme';
import { setAuthExpiredHandler, setToastHandler } from './api/client';
import { useUIStore } from './stores/uiStore';
import { useAuthStore } from './stores/authStore';
import { useActiveRideStore } from './stores/activeRideStore';

// Lazy-load every authed route — Landing + Login stay eager for fastest FCP.
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const MapPage = lazy(() => import('./pages/MapPage'));
const WalletPage = lazy(() => import('./pages/WalletPage'));
const HistoryPage = lazy(() => import('./pages/HistoryPage'));
const RideDetailPage = lazy(() => import('./pages/RideDetailPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ActiveRidePage = lazy(() => import('./pages/ActiveRidePage'));
const RideCompletePage = lazy(() => import('./pages/RideCompletePage'));
const OfflinePaymentsPage = lazy(() => import('./pages/admin/OfflinePaymentsPage'));
const LegalPage = lazy(() => import('./pages/LegalPage'));
const PasswordResetRequestPage = lazy(() => import('./pages/PasswordResetRequestPage'));
const PasswordResetConfirmPage = lazy(() => import('./pages/PasswordResetConfirmPage'));

export default function App() {
  useTheme();
  const navigate = useNavigate();
  const showToast = useUIStore((s) => s.showToast);

  useEffect(() => {
    setAuthExpiredHandler(() => navigate('/login', { replace: true }));
    setToastHandler((message, kind) => showToast(message, kind));
    return () => {
      setAuthExpiredHandler(null);
      setToastHandler(null);
    };
  }, [navigate, showToast]);

  // Reconcile any persisted active ride with the server once after auth has
  // rehydrated. The store also reconciles inside onRehydrateStorage but at
  // boot time the auth token may not be in localStorage yet — this rerun
  // ensures the request goes out with the Authorization header attached.
  useEffect(() => {
    const run = () => {
      if (useAuthStore.getState().isAuthenticated) {
        void useActiveRideStore.getState().reconcile();
      }
    };
    if (useAuthStore.persist.hasHydrated()) {
      run();
      return;
    }
    const unsub = useAuthStore.persist.onFinishHydration(run);
    return () => {
      unsub();
    };
  }, []);

  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        {/* No layout */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/password-reset" element={<PasswordResetRequestPage />} />
        <Route path="/reset-password" element={<PasswordResetConfirmPage />} />
        <Route path="/legal/privacy" element={<LegalPage kind="privacy" />} />
        <Route path="/legal/terms" element={<LegalPage kind="terms" />} />
        <Route path="/legal/cookies" element={<LegalPage kind="cookies" />} />

        {/* Authenticated app routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/history/:id" element={<RideDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/ride/active" element={<ActiveRidePage />} />
            <Route path="/ride/complete" element={<RideCompletePage />} />
          </Route>
        </Route>

        {/* Admin routes */}
        <Route element={<AdminRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/admin/payments" element={<OfflinePaymentsPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
