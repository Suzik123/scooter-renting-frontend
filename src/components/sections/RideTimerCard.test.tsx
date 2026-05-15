import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/utils';
import RideTimerCard from './RideTimerCard';
import { useActiveRideStore } from '../../stores/activeRideStore';

describe('RideTimerCard', () => {
  beforeEach(() => {
    useActiveRideStore.setState({
      activeRide: null,
      elapsedSeconds: 0,
      currentCost: 0,
    });
  });

  it('renders 00:00:00 when no ride is active', () => {
    renderWithProviders(<RideTimerCard />);
    expect(screen.getByText('00:00:00')).toBeInTheDocument();
  });

  it('formats elapsed time and current cost', () => {
    useActiveRideStore.setState({
      activeRide: {
        rental_id: 'r1',
        scooter_id: 'sc-1',
        scooter_label: 'Test',
        battery_level: 80,
        price_model_id: 'pm-1',
        price_per_minute: 0.2,
        unlock_fee: 1,
        currency: 'USD',
        start_time: new Date().toISOString(),
        startedAtMs: Date.now(),
      },
      elapsedSeconds: 125,
      currentCost: 1.42,
    });
    renderWithProviders(<RideTimerCard />);
    expect(screen.getByText('00:02:05')).toBeInTheDocument();
    expect(screen.getByText(/\$1\.42/)).toBeInTheDocument();
  });
});
