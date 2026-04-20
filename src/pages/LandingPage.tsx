import { Link } from 'react-router-dom';
import {
  Zap,
  Shield,
  Leaf,
  MapPin,
  Clock,
  Smartphone,
  Star,
  Check,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { pricingPlans } from '../mock/data';
import Button from '../components/ui/Button';

const features = [
  { icon: Zap, title: 'Lightning Fast', desc: 'Unlock any scooter in seconds with just your phone.' },
  { icon: Shield, title: 'Safe & Insured', desc: 'Every ride is fully insured for your peace of mind.' },
  { icon: Leaf, title: 'Eco-Friendly', desc: 'Zero emissions. Reduce your carbon footprint daily.' },
  { icon: MapPin, title: 'Everywhere', desc: 'Available across 120+ cities and growing every week.' },
  { icon: Clock, title: '24/7 Available', desc: 'Ride anytime, day or night. We never close.' },
  { icon: Smartphone, title: 'Easy to Use', desc: 'Intuitive app experience. No learning curve needed.' },
];

const testimonials = [
  { name: 'Sarah M.', role: 'University Student', text: 'UniScoot changed how I commute. Fast, cheap, and always available near campus!', rating: 5 },
  { name: 'Alex K.', role: 'Software Engineer', text: 'The weekly pass is incredible value. I use it every day for my commute downtown.', rating: 5 },
  { name: 'Maria L.', role: 'Freelance Designer', text: 'Love the eco-friendly aspect. Plus the app is beautifully designed and super easy to use.', rating: 4 },
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-lg font-bold text-slate-900">UniScoot</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#pricing" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Pricing</a>
            <a href="#features" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Community</a>
            <a href="#testimonials" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Partnerships</a>
            <a href="#footer" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Company</a>
          </nav>
          <div className="hidden md:block">
            <Link to="/login">
              <Button size="md">Get Riding</Button>
            </Link>
          </div>
          <button
            className="md:hidden p-2 text-slate-600 cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-3">
            <a href="#pricing" className="block text-sm text-slate-600" onClick={() => setMenuOpen(false)}>Pricing</a>
            <a href="#features" className="block text-sm text-slate-600" onClick={() => setMenuOpen(false)}>Community</a>
            <a href="#testimonials" className="block text-sm text-slate-600" onClick={() => setMenuOpen(false)}>Partnerships</a>
            <a href="#footer" className="block text-sm text-slate-600" onClick={() => setMenuOpen(false)}>Company</a>
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              <Button fullWidth>Get Riding</Button>
            </Link>
          </div>
        )}
      </header>

      {/* Hero */}
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
      <a href="#features" className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors h-11 px-2">
        Learn More
      </a>
    </div>
    {/* Stats */}
<section className="py-12">
  <div className="max-w-4xl mx-auto px-2 grid grid-cols-3 gap-4 ">
    <div>
      <p className="text-2xl sm:text-3xl font-bold text-slate-900">50K+</p>
      <p className="text-sm text-slate-500 ">Riders</p>
    </div>
    <div>
      <p className="text-2xl sm:text-3xl font-bold text-slate-900">120+</p>
      <p className="text-sm text-slate-500">Cities</p>
    </div>
    <div>
      <p className="text-2xl sm:text-3xl font-bold text-slate-900">4.8</p>
      <p className="text-sm text-slate-500">Rating</p>
    </div>
  </div>
</section>
  </div>

  <div className="w-full lg:w-1/2">
    <img 
      src="/scooter.png" 
      alt="Scooter ride" 
      className="w-full h-auto rounded-2xl shadow-lg"
    />
  </div>

</section>

      {/* Steps */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-4">Start Riding in 3 Simple Steps</h2>
        <p className="text-slate-500 text-center mb-12 max-w-xl mx-auto">Getting around has never been easier.</p>
        <div className="grid sm:grid-cols-3 gap-8">
          {[
            { step: '1', title: 'Find a Scooter', desc: 'Open the app and locate the nearest available scooter on the map.' },
            { step: '2', title: 'Scan & Unlock', desc: 'Scan the QR code on the scooter to unlock it instantly.' },
            { step: '3', title: 'Ride & Enjoy', desc: 'Hop on and ride to your destination. Park responsibly when done.' },
          ].map((item) => (
            <div key={item.step} className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-primary-light text-primary font-bold text-lg flex items-center justify-center mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-slate-50 py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-4">Why Riders Choose UniScoot</h2>
          <p className="text-slate-500 text-center mb-12 max-w-xl mx-auto">Built for urban mobility, loved by riders everywhere.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
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

      {/* Pricing */}
      <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-slate-500 text-center mb-12 max-w-xl mx-auto">Choose the plan that fits your lifestyle.</p>
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

      {/* Testimonials */}
      <section id="testimonials" className="bg-slate-50 py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-12">What Our Riders Say</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}
                    />
                  ))}
                </div>
                <p className="text-sm text-slate-600 mb-4">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-sm text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-dark-card rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to Ride?</h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">Join 50,000+ riders who are already enjoying smarter, greener transportation.</p>
          <Link to="/login">
            <Button size="lg">
              Get Riding <ChevronRight size={18} className="ml-1" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-lg font-bold text-white">UniScoot</span>
            </div>
            <p className="text-sm">Making urban transport smarter, greener, and more accessible for everyone.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#testimonials" className="hover:text-white transition-colors">Reviews</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Social</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-slate-800 text-sm text-center">
          2026 UniScoot. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
