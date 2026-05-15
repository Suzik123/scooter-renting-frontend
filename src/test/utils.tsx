import type { ReactElement, ReactNode } from 'react';
import { render, type RenderOptions, type RenderResult } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { GoogleOAuthProvider } from '@react-oauth/google';
import i18n from '../i18n';

interface ProviderOptions {
  route?: string;
  routes?: ReactNode;
}

export function renderWithProviders(
  ui: ReactElement,
  { route = '/', routes, ...rest }: ProviderOptions & Omit<RenderOptions, 'wrapper'> = {},
): RenderResult {
  return render(
    <GoogleOAuthProvider clientId="test-client-id">
      <I18nextProvider i18n={i18n}>
        <MemoryRouter initialEntries={[route]}>
          {routes ?? ui}
        </MemoryRouter>
      </I18nextProvider>
    </GoogleOAuthProvider>,
    rest,
  );
}

export { i18n };
