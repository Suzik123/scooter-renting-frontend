import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, i18n } from '../test/utils';
import PasswordResetRequestPage from './PasswordResetRequestPage';

vi.mock('../api/auth', async (orig) => {
  const actual = await orig<typeof import('../api/auth')>();
  return {
    ...actual,
    requestPasswordReset: vi.fn().mockResolvedValue(undefined),
  };
});

import { requestPasswordReset } from '../api/auth';

describe('PasswordResetRequestPage', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en');
    vi.mocked(requestPasswordReset).mockClear();
    vi.mocked(requestPasswordReset).mockResolvedValue(undefined);
  });

  it('renders the form', () => {
    renderWithProviders(<PasswordResetRequestPage />);
    expect(screen.getByRole('heading', { name: /reset your password/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument();
  });

  it('shows zod error on empty/invalid email and does not call the API', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PasswordResetRequestPage />);
    await user.click(screen.getByRole('button', { name: /send reset link/i }));
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
    expect(requestPasswordReset).not.toHaveBeenCalled();
  });

  it('shows the success view after a valid submit and normalizes the email', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PasswordResetRequestPage />);
    await user.type(screen.getByLabelText(/email/i), '  Jane@University.EDU ');
    await user.click(screen.getByRole('button', { name: /send reset link/i }));
    await waitFor(() => {
      expect(requestPasswordReset).toHaveBeenCalledWith({ email: 'jane@university.edu' });
    });
    expect(await screen.findByRole('heading', { name: /check your inbox/i })).toBeInTheDocument();
  });
});
