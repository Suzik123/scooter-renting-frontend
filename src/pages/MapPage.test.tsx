import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders, i18n } from '../test/utils';
import MapPage from './MapPage';
import { useScootersStore } from '../stores/scootersStore';
import { useZonesStore } from '../stores/zonesStore';

// Stub react-leaflet so it doesn't blow up jsdom (no DOM measurements available).
vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="map-container">{children}</div>
  ),
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ position }: { position: [number, number] }) => (
    <div data-testid="marker" data-pos={`${position[0]},${position[1]}`} />
  ),
  Circle: () => <div data-testid="circle" />,
  useMap: () => ({ flyTo: vi.fn(), setView: vi.fn(), getZoom: () => 14 }),
}));

describe('MapPage', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en');
    useScootersStore.setState({
      scooters: [
        {
          scooter_id: 'sc-1',
          battery_level: 85,
          status: 'available',
          lat: '40.7128',
          lng: '-74.0060',
          model: 'Test',
        },
      ],
      selectedScooterId: 'sc-1',
      filter: 'All',
      userLocation: { lat: 40.7, lng: -74 },
      loading: false,
      error: null,
      geoDenied: false,
    });
    useZonesStore.setState({ zones: [], loaded: true, loading: false, error: null });
  });

  it('renders the leaflet map container and scooter markers', async () => {
    renderWithProviders(<MapPage />);
    await waitFor(() => {
      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });
    expect(screen.getAllByTestId('marker').length).toBeGreaterThan(0);
  });

  it('shows the recenter button', () => {
    renderWithProviders(<MapPage />);
    expect(screen.getByRole('button', { name: /re-center map/i })).toBeInTheDocument();
  });
});
