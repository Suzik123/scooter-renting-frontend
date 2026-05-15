import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, i18n } from '../../test/utils';
import LocaleSwitcher from './LocaleSwitcher';

describe('LocaleSwitcher', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en');
  });

  it('renders both supported languages', () => {
    renderWithProviders(<LocaleSwitcher />);
    expect(screen.getByRole('button', { name: /english/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /polish/i })).toBeInTheDocument();
  });

  it('changes the active language on click', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LocaleSwitcher />);
    const pl = screen.getByRole('button', { name: /polish/i });
    await user.click(pl);
    expect(i18n.language).toMatch(/^pl/);
  });

  it('marks the active language with aria-pressed', () => {
    renderWithProviders(<LocaleSwitcher />);
    const en = screen.getByRole('button', { name: /english/i });
    expect(en).toHaveAttribute('aria-pressed', 'true');
  });
});
