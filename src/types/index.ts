export interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  registration_date: string;
  status: string;
  role: string;
}

export type ScooterStatus = 'available' | 'in_use' | 'low_battery' | 'maintenance' | 'reserved' | 'offline';

export interface Scooter {
  scooter_id: string;
  qr_code?: string;
  battery_level: number;
  status: ScooterStatus | string;
  zone_id?: string;
  // Backend serializes decimal.Decimal as a JSON string (e.g. "40.713").
  // Convert with toNum() at the use site.
  lat: string;
  lng: string;
  model?: string;
}

export interface Zone {
  zone_id: string;
  name: string;
  center_lat: number;
  center_lon: number;
  radius_meters: number;
  zone_type: string;
}

export interface PriceModel {
  price_model_id: string;
  name: string;
  // Decimal fields arrive as JSON strings. Use toNum() / formatCost() at consumption sites.
  unlock_fee: string;
  price_per_minute: string;
  currency: string;
  daily_cap?: string;
}

export type RentalStatus = 'active' | 'completed' | 'cancelled' | 'pending';

export interface Rental {
  rental_id: string;
  user_id: string;
  scooter_id: string;
  price_model_id: string;
  start_time: string;
  end_time?: string;
  // Decimal fields are JSON strings on the wire and may be null when geo
  // is missing (e.g. user denied location at start/end). Use toNum() / formatLatLng().
  start_lat?: string | null;
  start_lon?: string | null;
  end_lat?: string | null;
  end_lon?: string | null;
  total_cost?: string | null;
  status: RentalStatus | string;
  distance_m?: number;
}

export type PaymentStatus = 'succeeded' | 'pending' | 'failed' | 'refunded';

export interface Payment {
  payment_id: string;
  user_id: string;
  rental_id?: string;
  // Decimal field arrives as a JSON string. Use formatCost() / toNum().
  amount: string;
  currency: string;
  payment_method: string;
  status: PaymentStatus | string;
  transaction_date: string;
  failure_reason?: string;
}

export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  is_default: boolean;
}

export interface PaymentResult {
  id?: string;
  status: 'succeeded' | 'pending' | 'failed';
  client_secret?: string;
  failure_reason?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  highlighted: boolean;
  badge?: string;
}
