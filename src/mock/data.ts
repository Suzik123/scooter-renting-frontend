import type { PricingPlan } from '../types';

export const pricingPlans: PricingPlan[] = [
  {
    id: 'plan1',
    name: 'Per Minute',
    price: '$0.15',
    period: 'per minute',
    features: ['No commitment', 'Pay as you go', 'All scooter models', 'Basic support'],
    highlighted: false,
  },
  {
    id: 'plan2',
    name: 'Weekly Pass',
    price: '$9.99',
    period: 'per week',
    features: ['Unlimited rides', 'Free unlock', '30 min/day included', 'Priority scooters', 'No surge pricing'],
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    id: 'plan3',
    name: 'Monthly Pass',
    price: '$29.99',
    period: 'per month',
    features: ['Best value', 'Unlimited unlock', '60 min/day included', 'Premium scooters', '24/7 priority support', 'No surge pricing'],
    highlighted: false,
  },
];
