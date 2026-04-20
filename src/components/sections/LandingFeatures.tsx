import { Zap, Shield, Leaf, MapPin, Clock, Smartphone } from 'lucide-react';

const FEATURES = [
  { icon: Zap, title: 'Lightning Fast', desc: 'Unlock any scooter in seconds with just your phone.' },
  { icon: Shield, title: 'Safe & Insured', desc: 'Every ride is fully insured for your peace of mind.' },
  { icon: Leaf, title: 'Eco-Friendly', desc: 'Zero emissions. Reduce your carbon footprint daily.' },
  { icon: MapPin, title: 'Everywhere', desc: 'Available across 120+ cities and growing every week.' },
  { icon: Clock, title: '24/7 Available', desc: 'Ride anytime, day or night. We never close.' },
  { icon: Smartphone, title: 'Easy to Use', desc: 'Intuitive app experience. No learning curve needed.' },
];

export default function LandingFeatures() {
  return (
    <section id="features" className="bg-slate-50 py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-4">
          Why Riders Choose UniScoot
        </h2>
        <p className="text-slate-500 text-center mb-12 max-w-xl mx-auto">
          Built for urban mobility, loved by riders everywhere.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
              <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center mb-4">
                <f.icon size={20} className="text-primary" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
