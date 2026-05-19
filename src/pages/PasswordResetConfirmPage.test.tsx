import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { renderWithProviders, i18n } from '../test/utils';
import PasswordResetConfirmPage from './PasswordResetConfirmPage';
import { ApiError } from '../api/errors';

vi.mock('../api/auth', async (orig) => {
  const actual = await orig<typeof import('../api/auth')>();
  return {
    ...actual,
    confirmPasswordReset: vi.fn(),
  };
});

import { confirmPasswordReset } from '../api/auth';

function renderAt(route: string) {
  return renderWithProviders(<div />, {
    route,
    routes: (
      <Routes>
        <Route path="/reset-password" element={<PasswordResetConfirmPage />} />
        <Route path="/password-reset" element={<div>request page</div>} />
        <Route path="/login" element={<div>login page</div>} />
      </Routes>
    ),
  });
}

describe('PasswordResetConfirmPage', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en');
    vi.mocked(confirmPasswordReset).mockReset();
  });

  it('renders the form when a token is in the URL', () => {
    renderAt('/reset-password?token=abc123');
    expect(screen.getByRole('heading', { name: /set a new password/i })).toBeInTheDocument();
    expect(screen.getByLabelText('New password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm new password')).toBeInTheDocument();
  });

  it('redirects to /password-reset when no token is provided', () => {
    renderAt('/reset-password');
    expect(screen.getByText(/request page/i)).toBeInTheDocument();
  });

  it('submits and redirects to /login on success', async () => {
    const user = userEvent.setup();
    vi.mocked(confirmPasswordReset).mockResolvedValue(undefined);
    renderAt('/reset-password?token=abc123');
    await user.type(screen.getByLabelText('New password'), 'newpass123');
    await user.type(screen.getByLabelText('Confirm new password'), 'newpass123');
    await user.click(screen.getByRole('button', { name: /update password/i }));
    await waitFor(() => {
      expect(confirmPasswordReset).toHaveBeenCalledWith({
        token: 'abc123',
        new_password: 'newpass123',
      });
    });
    await waitFor(() => {
      expect(screen.getByText(/login page/i)).toBeInTheDocument();
    });
  });

  it('shows the expired view when the API returns 401', async () => {
    const user = userEvent.setup();
    vi.mocked(confirmPasswordReset).mockRejectedValue(
      new ApiError('invalid_token', 'expired', 401),
    );
    renderAt('/reset-password?token=abc123');
    await user.type(screen.getByLabelText('New password'), 'newpass123');
    await user.type(screen.getByLabelText('Confirm new password'), 'newpass123');
    await user.click(screen.getByRole('button', { name: /update password/i }));
    expect(await screen.findByRole('heading', { name: /link expired/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /request a new link/i })).toBeInTheDocument();
  });
});
