import L from 'leaflet';
import { Marker } from 'react-leaflet';

const USER_MARKER_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <circle cx="12" cy="12" r="11" fill="rgba(34,197,94,0.25)">
    <animate attributeName="r" values="6;11;6" dur="1.8s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.6;0;0.6" dur="1.8s" repeatCount="indefinite"/>
  </circle>
  <circle cx="12" cy="12" r="6" fill="#22C55E" stroke="white" stroke-width="2"/>
</svg>
`;

const userIcon = L.divIcon({
  html: USER_MARKER_SVG,
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

interface UserMarkerProps {
  position: [number, number];
}

export default function UserMarker({ position }: UserMarkerProps) {
  return <Marker position={position} icon={userIcon} keyboard={false} interactive={false} />;
}
