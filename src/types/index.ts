export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials: string;
  memberSince: string;
  plan: string;
  verified: boolean;
}

export interface Scooter {
  id: string;
  name: string;
  model: string;
  battery: number;
  distance: string;
  price: string;
  status: 'available' | 'in-use' | 'low-battery' | 'maintenance';
  lat?: number;
  lng?: number;
}

export interface Ride {
  id: string;
  scooterName: string;
  scooterId: string;
  from: string;
  to: string;
  date: string;
  dateLabel?: string;
  duration: string;
  distance: string;
  cost: string;
  avgSpeed: string;
  maxSpeed: string;
  rating: number;
  status: 'completed' | 'cancelled' | 'in-progress';
  co2Saved: string;
}

export interface Transaction {
  id: string;
  type: 'topup' | 'ride' | 'refund' | 'subscription';
  description: string;
  amount: string;
  date: string;
  positive: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'apple-pay';
  label: string;
  last4?: string;
  expiry?: string;
  isDefault: boolean;
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

export interface UserStats {
  totalRides: number;
  totalDistance: string;
  totalSpent: string;
  co2Saved: string;
  avgRideTime: string;
  favoriteScooter: string;
}
