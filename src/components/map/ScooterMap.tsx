import { useMemo } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import type { Scooter, Zone } from '../../types';
import { toNum } from '../../lib/decimal';
import UserMarker from './UserMarker';
import MapRecenter from './MapRecenter';

interface ScooterMapProps {
  center?: [number, number];
  userLocation?: [number, number] | null;
  scooters?: Scooter[];
  zones?: Zone[];
  selectedScooterId?: string | null;
  onScooterClick?: (id: string) => void;
  className?: string;
  zoom?: number;
  followUser?: boolean;
  showZones?: boolean;
}

const DEFAULT_CENTER: [number, number] = [52.2297, 21.0122]; // Warsaw, PL
const DEFAULT_ZOOM = 14;

function makeScooterIcon(opts: { selected: boolean; available: boolean }): L.DivIcon {
  const fill = !opts.available ? '#94A3B8' : opts.selected ? '#16A34A' : '#22C55E';
  const ring = opts.selected ? '#0F172A' : '#FFFFFF';
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
      <path d="M14 0c7 0 14 5.4 14 13.5C28 22 14 36 14 36S0 22 0 13.5C0 5.4 7 0 14 0z"
            fill="${fill}" stroke="${ring}" stroke-width="2" />
      <circle cx="14" cy="13" r="5" fill="white" />
    </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -32],
  });
}

type ZonePaint = {
  color: string;
  fillColor: string;
  fillOpacity: number;
  weight: number;
  dashArray?: string;
};

function zoneColor(zoneType: string): ZonePaint {
  switch (zoneType) {
    case 'no_park':
    case 'no_parking':
      return { color: '#EF4444', fillColor: '#EF4444', fillOpacity: 0.12, weight: 2 };
    case 'restricted':
      return { color: '#F59E0B', fillColor: '#F59E0B', fillOpacity: 0.10, weight: 2 };
    case 'reduced_speed':
      return { color: '#F59E0B', fillColor: '#F59E0B', fillOpacity: 0.08, weight: 2, dashArray: '6,4' };
    case 'service':
      // Operating area — faint dashed boundary so it doesn't visually
      // collide with smaller rule zones rendered on top of it.
      return { color: '#22C55E', fillColor: '#22C55E', fillOpacity: 0.04, weight: 1, dashArray: '4,6' };
    default:
      return { color: '#22C55E', fillColor: '#22C55E', fillOpacity: 0.06, weight: 2 };
  }
}

export default function ScooterMap({
  center,
  userLocation,
  scooters = [],
  zones = [],
  selectedScooterId,
  onScooterClick,
  className,
  zoom = DEFAULT_ZOOM,
  followUser = false,
  showZones = true,
}: ScooterMapProps) {
  const effectiveCenter: [number, number] = useMemo(() => {
    if (center) return center;
    if (userLocation) return userLocation;
    return DEFAULT_CENTER;
  }, [center, userLocation]);

  // De-duplicate zones by id so an upstream list with repeats never renders
  // two overlapping circles at the same coordinates.
  const uniqueZones = useMemo(() => {
    const seen = new Set<string>();
    return zones.filter((z) => {
      if (seen.has(z.zone_id)) return false;
      seen.add(z.zone_id);
      return true;
    });
  }, [zones]);

  const markers = useMemo(
    () =>
      scooters.map((s) => {
        const lat = toNum(s.lat);
        const lng = toNum(s.lng);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
        const selected = s.scooter_id === selectedScooterId;
        const available = s.status === 'available';
        return (
          <Marker
            key={s.scooter_id}
            position={[lat, lng]}
            icon={makeScooterIcon({ selected, available })}
            keyboard
            eventHandlers={{
              click: () => onScooterClick?.(s.scooter_id),
              keypress: (e) => {
                const ke = e.originalEvent as KeyboardEvent;
                if (ke.key === 'Enter' || ke.key === ' ') onScooterClick?.(s.scooter_id);
              },
            }}
          />
        );
      }),
    [scooters, selectedScooterId, onScooterClick],
  );

  return (
    <div className={className ?? 'absolute inset-0'}>
      <MapContainer
        center={effectiveCenter}
        zoom={zoom}
        scrollWheelZoom
        style={{ height: '100%', width: '100%' }}
        attributionControl
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          keepBuffer={1}
          updateWhenZooming={false}
        />
        <MapRecenter center={userLocation ?? null} follow={followUser} />
        {showZones &&
          uniqueZones.map((z) => (
            <Circle
              key={z.zone_id}
              center={[z.center_lat, z.center_lon]}
              radius={z.radius_meters}
              pathOptions={zoneColor(z.zone_type)}
              interactive={false}
            />
          ))}
        {markers}
        {userLocation && <UserMarker position={userLocation} />}
      </MapContainer>
    </div>
  );
}
