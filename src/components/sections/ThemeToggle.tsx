import { Sun, Moon, Monitor } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import { useThemeStore, type ThemeMode } from '../../stores/themeStore';

interface ThemeToggleProps {
  className?: string;
  /** Render as a compact icon-only group. Otherwise shows labels. */
  compact?: boolean;
}

const OPTIONS: ReadonlyArray<{ value: ThemeMode; Icon: typeof Sun }> = [
  { value: 'light', Icon: Sun },
  { value: 'dark', Icon: Moon },
  { value: 'system', Icon: Monitor },
];

export default function ThemeToggle({ className, compact }: ThemeToggleProps) {
  const { t } = useTranslation('common');
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);

  return (
    <div
      role="group"
      aria-label={t('theme.label')}
      className={clsx(
        'inline-flex items-center gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-muted)] p-1',
        className,
      )}
    >
      {OPTIONS.map(({ value, Icon }) => {
        const selected = theme === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            aria-pressed={selected}
            aria-label={t(`theme.${value}`)}
            title={t(`theme.${value}`)}
            className={clsx(
              'flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors cursor-pointer',
              selected
                ? 'bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] shadow-sm'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]',
            )}
          >
            <Icon size={14} />
            {!compact && <span>{t(`theme.${value}`)}</span>}
          </button>
        );
      })}
    </div>
  );
}
