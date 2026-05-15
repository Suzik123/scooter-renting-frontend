import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';

interface MapRecenterProps {
  center: [number, number] | null;
  /** When `true`, fly to the new center; otherwise the map stays put. */
  follow?: boolean;
  zoom?: number;
}

/**
 * Animates the map to a new center when `center` changes. Skips the first
 * render for a given center so the user can pan without being snapped back.
 */
export default function MapRecenter({ center, follow = false, zoom }: MapRecenterProps) {
  const map = useMap();
  const lastCenter = useRef<[number, number] | null>(null);

  useEffect(() => {
    if (!center) return;
    const [lat, lng] = center;
    const prev = lastCenter.current;
    lastCenter.current = [lat, lng];
    if (!prev) {
      map.setView([lat, lng], zoom ?? map.getZoom(), { animate: false });
      return;
    }
    if (!follow) return;
    map.flyTo([lat, lng], zoom ?? map.getZoom(), { duration: 0.6 });
  }, [center, follow, map, zoom]);

  return null;
}
