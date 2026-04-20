import LandingNavbar from '../components/sections/LandingNavbar';
import LandingHero from '../components/sections/LandingHero';
import LandingHowItWorks from '../components/sections/LandingHowItWorks';
import LandingFeatures from '../components/sections/LandingFeatures';
import LandingPricing from '../components/sections/LandingPricing';
import LandingTestimonials from '../components/sections/LandingTestimonials';
import LandingCTA from '../components/sections/LandingCTA';
import LandingFooter from '../components/sections/LandingFooter';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />
      <LandingHero />
      <LandingHowItWorks />
      <LandingFeatures />
      <LandingPricing />
      <LandingTestimonials />
      <LandingCTA />
      <LandingFooter />
    </div>
  );
}
