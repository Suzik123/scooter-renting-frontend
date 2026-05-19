import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, i18n } from '../../test/utils';
import EditProfileModal from './EditProfileModal';
import { useAuthStore } from '../../stores/authStore';
import type { User } from '../../types';

vi.mock('../../api/users', () => ({
  updateUser: vi.fn(),
}));

import { updateUser } from '../../api/users';

const baseUser: User = {
  user_id: 'user-1',
  first_name: 'Jane',
  last_name: 'Doe',
  email: 'jane@university.edu',
  phone_number: '+1 555 123 4567',
  registration_date: '2026-01-01T00:00:00Z',
  status: 'active',
  role: 'user',
};

describe('EditProfileModal', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en');
    vi.mocked(updateUser).mockReset();
    useAuthStore.setState({
      user: baseUser,
      token: 'test-token',
      isAuthenticated: true,
      loading: false,
      error: null,
    });
  });

  it('pre-fills current user values', () => {
    renderWithProviders(<EditProfileModal open onClose={() => {}} />);
    expect(screen.getByLabelText(/first name/i)).toHaveValue('Jane');
    expect(screen.getByLabelText(/last name/i)).toHaveValue('Doe');
    expect(screen.getByLabelText(/phone number/i)).toHaveValue('+1 555 123 4567');
    const email = screen.getByLabelText(/email/i) as HTMLInputElement;
    expect(email).toBeDisabled();
    expect(email).toHaveValue('jane@university.edu');
  });

  it('blocks submit when first name is cleared', async () => {
    const user = userEvent.setup();
    renderWithProviders(<EditProfileModal open onClose={() => {}} />);
    await user.clear(screen.getByLabelText(/first name/i));
    await user.click(screen.getByRole('button', { name: /^save$/i }));
    expect(await screen.findByText(/first name is required/i)).toBeInTheDocument();
    expect(updateUser).not.toHaveBeenCalled();
  });

  it('submits PUT and updates the auth store on success', async () => {
    const user = userEvent.setup();
    vi.mocked(updateUser).mockResolvedValue({ ...baseUser, first_name: 'Janet' });
    const onClose = vi.fn();
    renderWithProviders(<EditProfileModal open onClose={onClose} />);
    await user.clear(screen.getByLabelText(/first name/i));
    await user.type(screen.getByLabelText(/first name/i), 'Janet');
    await user.click(screen.getByRole('button', { name: /^save$/i }));
    await waitFor(() => {
      expect(updateUser).toHaveBeenCalledWith('user-1', expect.objectContaining({ first_name: 'Janet' }));
    });
    await waitFor(() => {
      expect(useAuthStore.getState().user?.first_name).toBe('Janet');
    });
    expect(onClose).toHaveBeenCalled();
  });

  it('surfaces API errors inline', async () => {
    const user = userEvent.setup();
    vi.mocked(updateUser).mockRejectedValue(new Error('Boom'));
    renderWithProviders(<EditProfileModal open onClose={() => {}} />);
    await user.clear(screen.getByLabelText(/first name/i));
    await user.type(screen.getByLabelText(/first name/i), 'Janet');
    await user.click(screen.getByRole('button', { name: /^save$/i }));
    expect(await screen.findByText(/boom/i)).toBeInTheDocument();
  });
});
