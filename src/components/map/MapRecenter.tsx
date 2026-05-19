import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';

interface MapRecenterProps {
  center: [number, number] | null;
  /** When `true`, fly to the new center whenever `center` changes. */
  follow?: boolean;
  /**
   * When this number changes (e.g. via a "Re-center" button), fly to the
   * current `center` regardless of `follow`. Pass `0` (or omit) to disable.
   */
  recenterKey?: number;
  zoom?: number;
}

/**
 * Animates the map to a new center when `center` changes. Skips the first
 * render for a given center so the user can pan without being snapped back.
 * Also flies to `center` whenever `recenterKey` increments — used by the
 * explicit "Re-center" map button.
 */
export default function MapRecenter({ center, follow = false, recenterKey, zoom }: MapRecenterProps) {
  const map = useMap();
  const lastCenter = useRef<[number, number] | null>(null);
  const lastRecenterKey = useRef<number | undefined>(recenterKey);

  // Track center changes (initial set + optional follow).
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

  // Explicit recenter trigger (from the on-map button).
  useEffect(() => {
    if (recenterKey === undefined) return;
    if (recenterKey === lastRecenterKey.current) return;
    lastRecenterKey.current = recenterKey;
    if (!center) return;
    map.flyTo(center, zoom ?? map.getZoom(), { duration: 0.6 });
  }, [recenterKey, center, map, zoom]);

  return null;
}
