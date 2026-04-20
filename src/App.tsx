import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MapPage from './pages/MapPage';
import WalletPage from './pages/WalletPage';
import HistoryPage from './pages/HistoryPage';
import RideDetailPage from './pages/RideDetailPage';
import ProfilePage from './pages/ProfilePage';
import ActiveRidePage from './pages/ActiveRidePage';
import RideCompletePage from './pages/RideCompletePage';

export default function App() {
  return (
    <Routes>
      {/* No layout */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* App layout with sidebar/bottom nav */}
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
    </Routes>
  );
}
