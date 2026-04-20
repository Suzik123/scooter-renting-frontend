import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import ToastHost from '../ui/ToastHost';
import TopUpModal from '../sections/TopUpModal';

export default function AppLayout() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="lg:ml-56 pb-20 lg:pb-0 min-h-screen">
        <Outlet />
      </main>
      <BottomNav />
      <ToastHost />
      <TopUpModal />
    </div>
  );
}
