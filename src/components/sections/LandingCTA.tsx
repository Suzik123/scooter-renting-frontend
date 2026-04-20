import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Button from '../ui/Button';

export default function LandingCTA() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-dark-card rounded-2xl p-8 sm:p-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to Ride?</h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          Join 50,000+ riders who are already enjoying smarter, greener transportation.
        </p>
        <Link to="/login">
          <Button size="lg">
            Get Riding <ChevronRight size={18} className="ml-1" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
