import { useEffect } from 'react';
import { resolveTheme, useThemeStore } from '../stores/themeStore';

/**
 * Applies the persisted theme to `<html>` and reacts to system-preference
 * changes when the user opted into `system` mode.
 *
 * Mount once near the application root.
 */
export function useTheme(): void {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const effective = resolveTheme(theme);
    root.classList.toggle('dark', effective === 'dark');

    if (theme !== 'system' || typeof window === 'undefined' || !window.matchMedia) {
      return;
    }
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => {
      root.classList.toggle('dark', e.matches);
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [theme]);
}
