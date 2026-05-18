import { Link } from 'react-router-dom';

interface FooterLink {
  to: string;
  label: string;
  external?: boolean;
}

const QUICK_LINKS: FooterLink[] = [
  { to: '#features', label: 'Features', external: true },
  { to: '#pricing', label: 'Pricing', external: true },
  { to: '#testimonials', label: 'Reviews', external: true },
];

const LEGAL_LINKS: FooterLink[] = [
  { to: '/legal/privacy', label: 'Privacy Policy' },
  { to: '/legal/terms', label: 'Terms of Service' },
  { to: '/legal/cookies', label: 'Cookie Policy' },
];

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h4 className="font-semibold text-white text-sm mb-3">{title}</h4>
      <ul className="space-y-2 text-sm">
        {links.map((l) =>
          l.external ? (
            <li key={l.label}>
              <a href={l.to} className="hover:text-white transition-colors">
                {l.label}
              </a>
            </li>
          ) : (
            <li key={l.label}>
              <Link to={l.to} className="hover:text-white transition-colors">
                {l.label}
              </Link>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}

export default function LandingFooter() {
  return (
    <footer id="footer" className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-8">
        <div className="col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-lg font-bold text-white">UniScoot</span>
          </div>
          <p className="text-sm">
            Making urban transport smarter, greener, and more accessible for everyone.
          </p>
        </div>
        <FooterColumn title="Quick Links" links={QUICK_LINKS} />
        <FooterColumn title="Legal" links={LEGAL_LINKS} />
      </div>
      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-slate-800 text-sm text-center">
        2026 UniScoot. All rights reserved.
      </div>
    </footer>
  );
}
