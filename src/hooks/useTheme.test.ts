import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from './useTheme';
import { useThemeStore } from '../stores/themeStore';

describe('useTheme', () => {
  beforeEach(() => {
    useThemeStore.setState({ theme: 'system' });
    document.documentElement.classList.remove('dark');
  });

  it('applies the dark class when theme is dark', () => {
    useThemeStore.setState({ theme: 'dark' });
    renderHook(() => useTheme());
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('removes the dark class when theme is light', () => {
    document.documentElement.classList.add('dark');
    useThemeStore.setState({ theme: 'light' });
    renderHook(() => useTheme());
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('reacts when the store changes', () => {
    const { rerender } = renderHook(() => useTheme());
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    act(() => useThemeStore.getState().setTheme('dark'));
    rerender();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
