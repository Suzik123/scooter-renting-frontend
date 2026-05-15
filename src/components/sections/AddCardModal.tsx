import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
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

const cardholderSchema = z.object({
  cardholder_name: z.string().trim().min(2, 'wallet:cardholderPlaceholder').max(80),
});
type CardholderInput = z.infer<typeof cardholderSchema>;

export default function AddCardModal({ open, onClose }: AddCardModalProps) {
  const { t } = useTranslation(['wallet', 'common']);
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
        const msg = isApiError(e) ? e.message : e instanceof Error ? e.message : t('wallet:saveFailed');
        setError(msg);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, t]);

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
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[var(--color-overlay)] p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-card-title"
      onClick={onClose}
    >
      <div
        className="bg-[var(--color-surface)] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-xl max-h-[90vh] overflow-y-auto border border-[var(--color-border)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-border-muted)]">
          <h2 id="add-card-title" className="text-lg font-bold text-[var(--color-text-primary)]">
            {t('wallet:addCardTitle')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[var(--color-text-faint)] hover:text-[var(--color-text-secondary)] cursor-pointer"
            aria-label={t('common:actions.close')}
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          {loading && <p className="text-sm text-[var(--color-text-muted)]">{t('wallet:preparingForm')}</p>}
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
  const { t } = useTranslation(['wallet', 'common']);
  const stripe = useStripe();
  const elements = useElements();
  const [stripeError, setStripeError] = useState<string | null>(null);
  const reload = usePaymentMethodsStore((s) => s.load);
  const showToast = useUIStore((s) => s.showToast);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CardholderInput>({
    resolver: zodResolver(cardholderSchema),
    defaultValues: { cardholder_name: '' },
    mode: 'onBlur',
  });

  const onSubmit = async (data: CardholderInput) => {
    if (!stripe || !elements) return;
    setStripeError(null);
    const { error: confirmError, setupIntent } = await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: window.location.href,
        payment_method_data: {
          billing_details: { name: data.cardholder_name },
        },
      },
      redirect: 'if_required',
    });
    if (confirmError) {
      setStripeError(confirmError.message ?? t('wallet:saveFailed'));
      return;
    }
    if (setupIntent && setupIntent.status === 'succeeded') {
      await reload();
      showToast(t('wallet:cardAdded'), 'success');
      onClose();
      return;
    }
    setStripeError(t('wallet:setupFailed'));
  };

  const inputClass =
    'w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-faint)] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label
          htmlFor="cardholder_name"
          className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5"
        >
          {t('wallet:cardholderName')}
        </label>
        <input
          id="cardholder_name"
          type="text"
          autoComplete="cc-name"
          placeholder={t('wallet:cardholderPlaceholder')}
          aria-invalid={!!errors.cardholder_name}
          aria-describedby={errors.cardholder_name ? 'cardholder_name-error' : undefined}
          className={inputClass}
          {...register('cardholder_name')}
        />
        {errors.cardholder_name && (
          <p id="cardholder_name-error" className="text-xs text-red-600 mt-1" role="alert">
            {t('wallet:cardholderPlaceholder')}
          </p>
        )}
      </div>
      <PaymentElement />
      {stripeError && (
        <p className="text-sm text-red-600" role="alert">
          {stripeError}
        </p>
      )}
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" fullWidth onClick={onClose} disabled={isSubmitting}>
          {t('common:actions.cancel')}
        </Button>
        <Button type="submit" fullWidth disabled={isSubmitting || !stripe || !elements}>
          {isSubmitting ? t('wallet:saving') : t('wallet:saveCard')}
        </Button>
      </div>
    </form>
  );
}
