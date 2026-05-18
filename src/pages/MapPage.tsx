import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, CreditCard, MapPinOff } from 'lucide-react';
import MapSearchBar from '../components/sections/MapSearchBar';
import MapFilterPills from '../components/sections/MapFilterPills';
import BestMatchCard from '../components/sections/BestMatchCard';
import ScooterList from '../components/sections/ScooterList';
import MapCanvas from '../components/sections/MapCanvas';
import { useScootersStore } from '../stores/scootersStore';
import { usePaymentMethodsStore } from '../stores/paymentMethodsStore';
import { usePriceModelsStore } from '../stores/priceModelsStore';
import { useActiveRideStore } from '../stores/activeRideStore';
import { useUIStore } from '../stores/uiStore';

function getPosition(): Promise<GeolocationPosition | null> {
  if (typeof navigator === 'undefined' || !navigator.geolocation) return Promise.resolve(null);
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos),
      () => resolve(null),
      { enableHighAccuracy: false, maximumAge: 30000, timeout: 5000 },
    );
  });
}

export default function MapPage() {
  const loadScooters = useScootersStore((s) => s.loadScooters);
  const setGeoDenied = useScootersStore((s) => s.setGeoDenied);
  const geoDenied = useScootersStore((s) => s.geoDenied);
  const loadMethods = usePaymentMethodsStore((s) => s.load);
  const methodsLoaded = usePaymentMethodsStore((s) => s.loaded);
  const methods = usePaymentMethodsStore((s) => s.methods);
  const loadPriceModels = usePriceModelsStore((s) => s.load);
  const priceModelsLoaded = usePriceModelsStore((s) => s.loaded);
  const needsCard = useActiveRideStore((s) => s.needsCard);
  const hasOutstanding = useActiveRideStore((s) => s.hasOutstanding);
  const clearFlags = useActiveRideStore((s) => s.clearFlags);
  const openAddCard = useUIStore((s) => s.openAddCard);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const pos = await getPosition();
      if (cancelled) return;
      if (pos) {
        setGeoDenied(false);
        loadScooters({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      } else {
        setGeoDenied(true);
        loadScooters();
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadScooters, setGeoDenied]);

  useEffect(() => {
    if (!methodsLoaded) loadMethods();
    if (!priceModelsLoaded) loadPriceModels();
  }, [methodsLoaded, priceModelsLoaded, loadMethods, loadPriceModels]);

  const showCardBanner = needsCard || (methodsLoaded && methods.length === 0);

  return (
    <div className="h-[calc(100vh-4rem)] lg:h-screen flex flex-col lg:flex-row">
      <div className="lg:w-80 lg:border-r lg:border-[var(--color-border)] bg-[var(--color-bg-elevated)] flex flex-col z-10 order-2 lg:order-1">
        <div className="p-4 border-b border-[var(--color-border-muted)]">
          <MapSearchBar />
          <MapFilterPills />
        </div>
        {geoDenied && (
          <div className="m-4 p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-2">
            <MapPinOff size={18} className="text-slate-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-slate-700">
              Location off — showing all scooters.
            </div>
          </div>
        )}
        {hasOutstanding && (
          <div className="m-4 p-3 rounded-xl border border-red-200 bg-red-50 flex items-start gap-2">
            <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-700">
              You have an unpaid ride.{' '}
              <Link to="/wallet" className="font-medium underline" onClick={clearFlags}>
                Settle it in Wallet
              </Link>
              {' '}before riding again.
            </div>
          </div>
        )}
        {showCardBanner && (
          <div className="m-4 p-3 rounded-xl border border-amber-200 bg-amber-50 flex items-start gap-2">
            <CreditCard size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800 flex-1">
              Add a payment card to start riding.
              <button
                type="button"
                onClick={() => {
                  clearFlags();
                  navigate('/wallet');
                  openAddCard();
                }}
                className="ml-2 font-medium underline cursor-pointer"
              >
                Add card
              </button>
            </div>
          </div>
        )}
        <BestMatchCard />
        <ScooterList />
      </div>
      <MapCanvas />
    </div>
  );
}
