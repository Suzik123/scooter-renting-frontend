import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders, i18n } from '../../test/utils';
import ActivePlanCard from './ActivePlanCard';

describe('ActivePlanCard', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en');
  });

  it('renders the Pay-as-you-go label and Coming soon copy', () => {
    renderWithProviders(<ActivePlanCard />);
    expect(screen.getByText(/active plan/i)).toBeInTheDocument();
    expect(screen.getByText(/pay-as-you-go/i)).toBeInTheDocument();
    expect(screen.getByText(/coming soon/i)).toBeInTheDocument();
  });

  it('does not render a hardcoded minute total', () => {
    renderWithProviders(<ActivePlanCard />);
    expect(screen.queryByText(/38\s*\/\s*60/)).not.toBeInTheDocument();
    expect(screen.queryByText(/minutes? remaining/i)).not.toBeInTheDocument();
  });
});
