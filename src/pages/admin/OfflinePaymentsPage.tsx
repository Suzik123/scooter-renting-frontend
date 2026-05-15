import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import Button from '../../components/ui/Button';
import { offlinePaymentSchema, type OfflinePaymentInput } from '../../lib/validation/admin';
import { request } from '../../api/client';
import { useUIStore } from '../../stores/uiStore';
import { isApiError } from '../../api/errors';

function newIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  // Fallback (older browsers) — not cryptographically strong.
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

const INPUT_CLASS =
  'w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-faint)] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent';

export default function OfflinePaymentsPage() {
  const { t } = useTranslation(['ride', 'common']);
  const showToast = useUIStore((s) => s.showToast);
  const [serverError, setServerError] = useState<string | null>(null);
  const idempotencyKey = useMemo(() => newIdempotencyKey(), []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<OfflinePaymentInput>({
    resolver: zodResolver(offlinePaymentSchema),
    defaultValues: {
      rental_id: '',
      amount: '',
      currency: 'USD',
      note: '',
      idempotency_key: idempotencyKey,
    },
  });

  useEffect(() => {
    setValue('idempotency_key', idempotencyKey, { shouldDirty: false });
  }, [idempotencyKey, setValue]);

  const onSubmit = async (data: OfflinePaymentInput) => {
    setServerError(null);
    try {
      await request('/api/admin/payments/offline', { method: 'POST', body: data });
      showToast(t('ride:admin.success'), 'success');
      reset({
        rental_id: '',
        amount: '',
        currency: data.currency,
        note: '',
        idempotency_key: newIdempotencyKey(),
      });
    } catch (e) {
      const msg = isApiError(e) ? e.message : t('common:errors.generic');
      setServerError(msg);
    }
  };

  const translateError = (key: string | undefined): string | undefined => {
    if (!key) return undefined;
    return t(key, { defaultValue: key });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] mb-1">
        {t('ride:admin.title')}
      </h1>
      <p className="text-sm text-[var(--color-text-muted)] mb-6">{t('ride:admin.subtitle')}</p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-5 shadow-sm"
        noValidate
      >
        <div>
          <label htmlFor="rental_id" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
            {t('ride:admin.rentalId')}
          </label>
          <input
            id="rental_id"
            type="text"
            autoComplete="off"
            placeholder={t('ride:admin.rentalIdPlaceholder')}
            aria-invalid={!!errors.rental_id}
            aria-describedby={errors.rental_id ? 'rental_id-error' : undefined}
            className={INPUT_CLASS}
            {...register('rental_id')}
          />
          {errors.rental_id && (
            <p id="rental_id-error" className="text-xs text-red-600 mt-1" role="alert">
              {translateError(errors.rental_id.message)}
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <label htmlFor="amount" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
              {t('ride:admin.amount')}
            </label>
            <input
              id="amount"
              type="text"
              inputMode="decimal"
              placeholder={t('ride:admin.amountPlaceholder')}
              aria-invalid={!!errors.amount}
              aria-describedby={errors.amount ? 'amount-error' : undefined}
              className={INPUT_CLASS}
              {...register('amount')}
            />
            {errors.amount && (
              <p id="amount-error" className="text-xs text-red-600 mt-1" role="alert">
                {translateError(errors.amount.message)}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
              {t('ride:admin.currency')}
            </label>
            <input
              id="currency"
              type="text"
              maxLength={3}
              aria-invalid={!!errors.currency}
              className={`${INPUT_CLASS} uppercase`}
              {...register('currency')}
            />
            {errors.currency && (
              <p className="text-xs text-red-600 mt-1" role="alert">
                {translateError(errors.currency.message)}
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="note" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
            {t('ride:admin.note')}
          </label>
          <textarea
            id="note"
            rows={3}
            placeholder={t('ride:admin.notePlaceholder')}
            aria-invalid={!!errors.note}
            className={INPUT_CLASS}
            {...register('note')}
          />
          {errors.note && (
            <p className="text-xs text-red-600 mt-1" role="alert">
              {translateError(errors.note.message)}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="idempotency_key" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
            {t('ride:admin.idempotencyKey')}
          </label>
          <input
            id="idempotency_key"
            type="text"
            readOnly
            className={`${INPUT_CLASS} text-xs text-[var(--color-text-muted)]`}
            {...register('idempotency_key')}
          />
        </div>

        {serverError && (
          <p className="text-sm text-red-600" role="alert">
            {serverError}
          </p>
        )}

        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? t('ride:admin.submitting') : t('ride:admin.submit')}
        </Button>
      </form>
    </div>
  );
}
