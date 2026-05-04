import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import Button from '../ui/Button';
import { stripePromise } from '../../lib/stripe';
import * as paymentsApi from '../../api/payments';
import { usePaymentMethodsStore } from '../../stores/paymentMethodsStore';
import { useUIStore } from '../../stores/uiStore';
import { isApiError } from '../../api/errors';

interface AddCardModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddCardModal({ open, onClose }: AddCardModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setClientSecret(null);
      setError(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    paymentsApi
      .createSetupIntent()
      .then((res) => {
        if (!cancelled) setClientSecret(res.client_secret);
      })
      .catch((e) => {
        if (cancelled) return;
        const msg = isApiError(e) ? e.message : e instanceof Error ? e.message : 'Failed to start setup';
        setError(msg);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-card-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 id="add-card-title" className="text-lg font-bold text-slate-900">
            Add Payment Card
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 cursor-pointer"
            aria-label="Close add card"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          {loading && <p className="text-sm text-slate-500">Preparing secure form...</p>}
          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          {clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CardForm onClose={onClose} />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
}

interface CardFormProps {
  onClose: () => void;
}

function CardForm({ onClose }: CardFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reload = usePaymentMethodsStore((s) => s.load);
  const showToast = useUIStore((s) => s.showToast);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError(null);
    const { error: stripeError, setupIntent } = await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: 'if_required',
    });
    if (stripeError) {
      setError(stripeError.message ?? 'Failed to save card');
      setSubmitting(false);
      return;
    }
    if (setupIntent && setupIntent.status === 'succeeded') {
      await reload();
      showToast('Card added', 'success');
      setSubmitting(false);
      onClose();
      return;
    }
    setSubmitting(false);
    setError('Card setup did not complete. Please try again.');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" fullWidth onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" fullWidth disabled={submitting || !stripe || !elements}>
          {submitting ? 'Saving...' : 'Save Card'}
        </Button>
      </div>
    </form>
  );
}
