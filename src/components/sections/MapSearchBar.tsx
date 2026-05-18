import { Search, Filter } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function MapSearchBar() {
  const { t } = useTranslation('map');
  const placeholder = t('search.placeholder');
  return (
    <div className="relative">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
      />
      <input
        type="text"
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full pl-10 pr-10 py-2.5 bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
      <button
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] cursor-pointer"
        aria-label={t('filters.all')}
      >
        <Filter size={16} />
      </button>
    </div>
  );
}
