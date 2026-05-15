import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { SUPPORTED_LNGS, type SupportedLng } from '../../i18n';

interface LocaleSwitcherProps {
  className?: string;
}

const LABEL_BY_LNG: Record<SupportedLng, string> = {
  en: 'EN',
  pl: 'PL',
};

export default function LocaleSwitcher({ className }: LocaleSwitcherProps) {
  const { i18n, t } = useTranslation('common');
  const current = (i18n.resolvedLanguage ?? i18n.language ?? 'en').slice(0, 2) as SupportedLng;

  const handleChange = (lng: SupportedLng) => {
    if (lng === current) return;
    void i18n.changeLanguage(lng);
  };

  return (
    <div
      role="group"
      aria-label={t('language.label')}
      className={clsx(
        'inline-flex items-center gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-muted)] p-1',
        className,
      )}
    >
      {SUPPORTED_LNGS.map((lng) => {
        const selected = lng === current;
        return (
          <button
            key={lng}
            type="button"
            onClick={() => handleChange(lng)}
            aria-pressed={selected}
            aria-label={t(`language.${lng}`)}
            className={clsx(
              'rounded-md px-2 py-1 text-xs font-semibold transition-colors cursor-pointer',
              selected
                ? 'bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] shadow-sm'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]',
            )}
          >
            {LABEL_BY_LNG[lng]}
          </button>
        );
      })}
    </div>
  );
}
