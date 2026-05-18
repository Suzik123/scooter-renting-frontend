import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

type LegalKind = 'privacy' | 'terms' | 'cookies';

interface LegalPageProps {
  kind: LegalKind;
}

const CONTENT: Record<LegalKind, { title: string; body: string[] }> = {
  privacy: {
    title: 'Privacy Policy',
    body: [
      'UniScoot collects only the data needed to run rentals: your name, email, ride history, and approximate location while a ride is active. We never sell personal data to third parties.',
      'Payment information is processed by Stripe; we never see or store your full card number.',
      'You can request export or deletion of your data at any time by contacting support. This is a university-project placeholder; production wording will be finalized before launch.',
    ],
  },
  terms: {
    title: 'Terms of Service',
    body: [
      'By creating a UniScoot account you agree to follow local traffic laws, wear a helmet where required, and return scooters to designated zones.',
      'Rentals are billed per minute plus an unlock fee. Outstanding charges must be settled before starting a new ride.',
      'UniScoot reserves the right to suspend accounts that abuse the service. This is a university-project placeholder; full terms will be published before launch.',
    ],
  },
  cookies: {
    title: 'Cookie Policy',
    body: [
      'UniScoot uses a small number of strictly necessary cookies to keep you signed in and to remember your language and theme preferences.',
      'We do not use third-party advertising cookies. Analytics, if enabled, are aggregated and never tied to your name.',
      'You can clear cookies from your browser at any time; you will simply be asked to sign in again. This is a university-project placeholder.',
    ],
  },
};

export default function LegalPage({ kind }: LegalPageProps) {
  const { title, body } = CONTENT[kind];
  return (
    <div className="min-h-screen bg-[var(--color-bg)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] mb-6"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to home
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] mb-6">
          {title}
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mb-8">
          Last updated: 2026
        </p>
        <div className="space-y-5 text-[var(--color-text-secondary)] leading-relaxed">
          {body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
