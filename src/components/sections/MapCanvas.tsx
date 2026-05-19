import { useEffect } from 'react';
import { Navigation } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ScooterMap from '../map/ScooterMap';
import { useScootersStore } from '../../stores/scootersStore';
import { useZonesStore } from '../../stores/zonesStore';
import { useUIStore } from '../../stores/uiStore';

function getCurrentPosition(timeoutMs = 5000): Promise<GeolocationPosition | null> {
  if (typeof navigator === 'undefined' || !navigator.geolocation) return Promise.resolve(null);
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos),
      () => resolve(null),
      { enableHighAccuracy: false, maximumAge: 30000, timeout: timeoutMs },
    );
  });
}

export default function MapCanvas() {
  const { t } = useTranslation('map');
  const scooters = useScootersStore((s) => s.scooters);
  const selectedScooterId = useScootersStore((s) => s.selectedScooterId);
  const selectScooter = useScootersStore((s) => s.selectScooter);
  const userLocation = useScootersStore((s) => s.userLocation);
  const recenterAt = useScootersStore((s) => s.recenterAt);
  const requestRecenter = useScootersStore((s) => s.requestRecenter);
  const setUserLocation = useScootersStore((s) => s.setUserLocation);
  const setGeoDenied = useScootersStore((s) => s.setGeoDenied);
  const zones = useZonesStore((s) => s.zones);
  const loadZones = useZonesStore((s) => s.load);
  const zonesLoaded = useZonesStore((s) => s.loaded);
  const showToast = useUIStore((s) => s.showToast);

  useEffect(() => {
    if (!zonesLoaded) void loadZones();
  }, [zonesLoaded, loadZones]);

  const userPosition = userLocation ? ([userLocation.lat, userLocation.lng] as [number, number]) : null;

  const handleRecenter = async () => {
    if (userLocation) {
      requestRecenter();
      return;
    }
    const pos = await getCurrentPosition();
    if (!pos) {
      setGeoDenied(true);
      showToast(t('locationDenied'), 'error');
      return;
    }
    setGeoDenied(false);
    setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    requestRecenter();
  };

  return (
    <div className="flex-1 relative order-1 lg:order-2 min-h-[200px] lg:min-h-0">
      <ScooterMap
        userLocation={userPosition}
        scooters={scooters}
        zones={zones}
        selectedScooterId={selectedScooterId}
        onScooterClick={selectScooter}
        followUser
        recenterKey={recenterAt}
      />
      <button
        type="button"
        onClick={handleRecenter}
        className="absolute bottom-4 right-4 z-[400] w-10 h-10 bg-[var(--color-bg-elevated)] rounded-full shadow-md flex items-center justify-center hover:bg-[var(--color-bg-muted)] transition-colors cursor-pointer text-[var(--color-text-secondary)]"
        aria-label={t('recenter')}
      >
        <Navigation size={18} />
      </button>
    </div>
  );
}
