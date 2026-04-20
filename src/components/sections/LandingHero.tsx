import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Button from '../ui/Button';

const STATS = [
  { value: '50K+', label: 'Riders' },
  { value: '120+', label: 'Cities' },
  { value: '4.8', label: 'Rating' },
];

export default function LandingHero() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-15">
      <div className="w-full lg:w-1/2 text-left">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight mb-6">
          Ride the City.<br />
          <span className="text-primary">Fast. Green. Effortless.</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-500 mb-10">
          Unlock a scooter in seconds and zip through the city. Affordable, eco-friendly transportation at your fingertips.
        </p>

        <div className="flex flex-col sm:flex-row items-start gap-4">
          <Link to="/login">
            <Button size="lg">
              Get Riding <ChevronRight size={18} className="ml-1" />
            </Button>
          </Link>
          <a
            href="#features"
            className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors h-11 px-2"
          >
            Learn More
          </a>
        </div>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-2 grid grid-cols-3 gap-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900">{s.value}</p>
                <p className="text-sm text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="w-full lg:w-1/2">
        <img src="/scooter.png" alt="Scooter ride" className="w-full h-auto rounded-2xl shadow-lg" />
      </div>
    </section>
  );
}
