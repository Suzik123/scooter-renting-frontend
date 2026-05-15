import { http, HttpResponse } from 'msw';

const BASE = 'http://localhost:8080';

const mockUser = {
  user_id: 'user-1',
  first_name: 'Jane',
  last_name: 'Doe',
  email: 'jane@university.edu',
  registration_date: '2026-01-01T00:00:00Z',
  status: 'active',
  role: 'user',
};

const mockScooters = [
  {
    scooter_id: 'sc-1',
    battery_level: 85,
    status: 'available',
    lat: '40.7128',
    lng: '-74.0060',
    model: 'UniScoot S1',
  },
];

const mockZones = [
  {
    zone_id: 'zone-1',
    name: 'Central',
    center_lat: 40.7128,
    center_lon: -74.0060,
    radius_meters: 500,
    zone_type: 'service',
  },
];

export const handlers = [
  http.post(`${BASE}/api/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string };
    if (!body.email || !body.password) {
      return HttpResponse.json(
        { error: { kind: 'invalid_input', message: 'Invalid credentials' } },
        { status: 400 },
      );
    }
    return HttpResponse.json({ data: { token: 'test-token', user: mockUser } });
  }),

  http.post(`${BASE}/api/auth/register`, async () => {
    return HttpResponse.json({ data: { token: 'test-token', user: mockUser } });
  }),

  http.post(`${BASE}/api/auth/logout`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${BASE}/api/scooters/nearby`, () => {
    return HttpResponse.json({ data: { items: mockScooters, total: mockScooters.length } });
  }),

  http.get(`${BASE}/api/scooters`, () => {
    return HttpResponse.json({ data: { items: mockScooters, total: mockScooters.length } });
  }),

  http.get(`${BASE}/api/zones`, () => {
    return HttpResponse.json({ data: { items: mockZones, total: mockZones.length } });
  }),

  http.get(`${BASE}/api/users/:userId/payments`, () => {
    return HttpResponse.json({ data: { items: [], total: 0 } });
  }),

  http.get(`${BASE}/api/payments/methods`, () => {
    return HttpResponse.json({ data: { methods: [] } });
  }),

  http.post(`${BASE}/api/payments/setup-intent`, () => {
    return HttpResponse.json({
      data: { client_secret: 'seti_test_secret', setup_intent_id: 'seti_test' },
    });
  }),

  http.post(`${BASE}/api/admin/payments/offline`, () => {
    return HttpResponse.json(
      {
        data: {
          payment_id: 'pay-offline-1',
          user_id: 'user-1',
          amount: '10.00',
          currency: 'USD',
          payment_method: 'offline',
          status: 'succeeded',
          transaction_date: '2026-05-14T12:00:00Z',
        },
      },
      { status: 201 },
    );
  }),
];
