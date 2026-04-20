const STEPS = [
  { step: '1', title: 'Find a Scooter', desc: 'Open the app and locate the nearest available scooter on the map.' },
  { step: '2', title: 'Scan & Unlock', desc: 'Scan the QR code on the scooter to unlock it instantly.' },
  { step: '3', title: 'Ride & Enjoy', desc: 'Hop on and ride to your destination. Park responsibly when done.' },
];

export default function LandingHowItWorks() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-slate-900 mb-4">
        Start Riding in 3 Simple Steps
      </h2>
      <p className="text-slate-500 text-center mb-12 max-w-xl mx-auto">
        Getting around has never been easier.
      </p>
      <div className="grid sm:grid-cols-3 gap-8">
        {STEPS.map((item) => (
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
  );
}
