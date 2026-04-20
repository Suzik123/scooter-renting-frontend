import RatingStars from '../ui/RatingStars';

const TESTIMONIALS = [
  {
    name: 'Sarah M.',
    role: 'University Student',
    text: 'UniScoot changed how I commute. Fast, cheap, and always available near campus!',
    rating: 5,
  },
  {
    name: 'Alex K.',
    role: 'Software Engineer',
    text: 'The weekly pass is incredible value. I use it every day for my commute downtown.',
    rating: 5,
  },
  {
    name: 'Maria L.',
    role: 'Freelance Designer',
    text: 'Love the eco-friendly aspect. Plus the app is beautifully designed and super easy to use.',
    rating: 4,
  },
];

export default function LandingTestimonials() {
  return (
    <section id="testimonials" className="bg-slate-50 py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-12">
          What Our Riders Say
        </h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
              <RatingStars value={t.rating} size={16} className="mb-4" />
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
  );
}
