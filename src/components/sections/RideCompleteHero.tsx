import { CheckCircle } from 'lucide-react';

export default function RideCompleteHero() {
  return (
    <div className="text-center lg:text-left">
      <CheckCircle size={48} className="text-primary mx-auto lg:mx-0 mb-3" />
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Ride Complete!</h1>
      <p className="text-sm text-slate-500">Great ride! Here's your summary.</p>
    </div>
  );
}
