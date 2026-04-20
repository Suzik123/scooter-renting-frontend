import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import Button from '../ui/Button';
import { pricingPlans } from '../../mock/data';

export default function LandingPricing() {
  return (
    <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-slate-500 text-center mb-12 max-w-xl mx-auto">
          Choose the plan that fits your lifestyle.
        </p>
        <div className="grid sm:grid-cols-3 gap-6">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-xl border p-6 ${
                plan.highlighted
                  ? 'border-primary bg-primary-light shadow-lg ring-2 ring-primary relative'
                  : 'border-slate-100 bg-white shadow-sm'
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
                  {plan.badge}
                </span>
              )}
              <h3 className="font-semibold text-slate-900 mb-1">{plan.name}</h3>
              <p className="text-3xl font-bold text-slate-900 mb-1">{plan.price}</p>
              <p className="text-sm text-slate-500 mb-6">{plan.period}</p>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2 text-sm text-slate-600">
                    <Check size={16} className="text-primary flex-shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>
              <Link to="/login">
                <Button fullWidth variant={plan.highlighted ? 'primary' : 'outline'}>
                  Get Started
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
