import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { Routes, Route } from 'react-router-dom';
import { renderWithProviders } from '../../test/utils';
import ProtectedRoute from './ProtectedRoute';
import { useAuthStore } from '../../stores/authStore';

const Protected = () => <div>protected-content</div>;
const Login = () => <div>login-page</div>;

function setupRoutes(initial: string) {
  return renderWithProviders(<></>, {
    route: initial,
    routes: (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Protected />} />
        </Route>
      </Routes>
    ),
  });
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
  });

  it('redirects unauthenticated users to /login', async () => {
    setupRoutes('/dashboard');
    expect(await screen.findByText('login-page')).toBeInTheDocument();
    expect(screen.queryByText('protected-content')).not.toBeInTheDocument();
  });

  it('renders the protected outlet when authenticated', async () => {
    useAuthStore.setState({
      isAuthenticated: true,
      token: 'tok',
      user: {
        user_id: 'u1',
        first_name: 'A',
        last_name: 'B',
        email: 'a@b.com',
        registration_date: '2026-01-01T00:00:00Z',
        status: 'active',
        role: 'user',
      },
    });
    setupRoutes('/dashboard');
    expect(await screen.findByText('protected-content')).toBeInTheDocument();
  });

  it('blocks non-admin from admin route', async () => {
    useAuthStore.setState({
      isAuthenticated: true,
      token: 'tok',
      user: {
        user_id: 'u1',
        first_name: 'A',
        last_name: 'B',
        email: 'a@b.com',
        registration_date: '2026-01-01T00:00:00Z',
        status: 'active',
        role: 'user',
      },
    });
    renderWithProviders(<></>, {
      route: '/admin',
      routes: (
        <Routes>
          <Route path="/dashboard" element={<div>dashboard</div>} />
          <Route element={<ProtectedRoute requiresAdmin />}>
            <Route path="/admin" element={<div>admin-page</div>} />
          </Route>
        </Routes>
      ),
    });
    expect(await screen.findByText('dashboard')).toBeInTheDocument();
    expect(screen.queryByText('admin-page')).not.toBeInTheDocument();
  });
});
