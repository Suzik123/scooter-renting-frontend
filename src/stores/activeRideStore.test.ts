import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { Rental } from '../types';
import { ApiError } from '../api/errors';

vi.mock('../api/rentals', () => ({
  startRental: vi.fn(),
  endRental: vi.fn(),
  getRental: vi.fn(),
}));

import * as rentalsApi from '../api/rentals';
import { useActiveRideStore, type ActiveRide } from './activeRideStore';

const baseRide: ActiveRide = {
  rental_id: 'r-1',
  scooter_id: 'sc-1',
  scooter_label: 'Scooter sc-1',
  battery_level: 80,
  price_model_id: 'pm-1',
  price_per_minute: 0.2,
  unlock_fee: 1.0,
  currency: 'USD',
  start_time: new Date(Date.now() - 60_000).toISOString(),
  startedAtMs: Date.now() - 60_000,
};

function baseRental(overrides: Partial<Rental> = {}): Rental {
  return {
    rental_id: 'r-1',
    user_id: 'user-1',
    scooter_id: 'sc-1',
    price_model_id: 'pm-1',
    start_time: new Date(Date.now() - 60_000).toISOString(),
    status: 'active',
    ...overrides,
  };
}

describe('activeRideStore.reconcile', () => {
  beforeEach(() => {
    vi.mocked(rentalsApi.getRental).mockReset();
    useActiveRideStore.setState({
      activeRide: null,
      elapsedSeconds: 0,
      currentCost: 0,
      loading: false,
      error: null,
      needsCard: false,
      hasOutstanding: false,
      finishedRental: null,
      finishedPayment: null,
    });
  });

  afterEach(() => {
    // Make sure ticker doesn't leak between tests.
    useActiveRideStore.getState().cancelRide();
  });

  it('no-ops when there is no active ride', async () => {
    await useActiveRideStore.getState().reconcile();
    expect(rentalsApi.getRental).not.toHaveBeenCalled();
  });

  it('keeps state when the backend says the rental is still active', async () => {
    useActiveRideStore.setState({ activeRide: baseRide });
    vi.mocked(rentalsApi.getRental).mockResolvedValue(baseRental({ status: 'active' }));
    await useActiveRideStore.getState().reconcile();
    expect(useActiveRideStore.getState().activeRide).not.toBeNull();
  });

  it('clears state when the backend says the rental is completed', async () => {
    useActiveRideStore.setState({ activeRide: baseRide });
    vi.mocked(rentalsApi.getRental).mockResolvedValue(baseRental({ status: 'completed' }));
    await useActiveRideStore.getState().reconcile();
    expect(useActiveRideStore.getState().activeRide).toBeNull();
    expect(useActiveRideStore.getState().elapsedSeconds).toBe(0);
  });

  it('clears state on 404', async () => {
    useActiveRideStore.setState({ activeRide: baseRide });
    vi.mocked(rentalsApi.getRental).mockRejectedValue(new ApiError('not_found', 'gone', 404));
    await useActiveRideStore.getState().reconcile();
    expect(useActiveRideStore.getState().activeRide).toBeNull();
  });

  it('tolerates network errors and keeps state intact', async () => {
    useActiveRideStore.setState({ activeRide: baseRide });
    vi.mocked(rentalsApi.getRental).mockRejectedValue(new ApiError('network', 'down', 0));
    await useActiveRideStore.getState().reconcile();
    expect(useActiveRideStore.getState().activeRide).not.toBeNull();
  });
});
