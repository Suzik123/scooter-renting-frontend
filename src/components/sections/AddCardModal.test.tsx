import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, i18n } from '../../test/utils';
import AddCardModal from './AddCardModal';

// Stripe Elements depends on iframe + fetch — stub it out at the integration
// boundary so we can verify our own RHF wrapping logic.
vi.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="stripe-elements">{children}</div>
  ),
  PaymentElement: () => <div data-testid="payment-element" />,
  useStripe: () => ({ confirmSetup: vi.fn().mockResolvedValue({ setupIntent: { status: 'succeeded' } }) }),
  useElements: () => ({}),
}));

describe('AddCardModal', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('en');
  });

  it('renders nothing when closed', () => {
    const { container } = renderWithProviders(<AddCardModal open={false} onClose={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the modal title and dismiss control when open', async () => {
    renderWithProviders(<AddCardModal open onClose={() => {}} />);
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/add payment card/i)).toBeInTheDocument();
  });

  it('renders the cardholder field once Stripe Elements mounts', async () => {
    renderWithProviders(<AddCardModal open onClose={() => {}} />);
    await waitFor(() => {
      expect(screen.getByLabelText(/cardholder name/i)).toBeInTheDocument();
    });
    expect(screen.getByTestId('payment-element')).toBeInTheDocument();
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProviders(<AddCardModal open onClose={onClose} />);
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });
});
