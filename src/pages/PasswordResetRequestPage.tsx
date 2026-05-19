import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button';
import LoginHeroPanel from '../components/sections/LoginHeroPanel';
import {
  passwordResetRequestSchema,
  type PasswordResetRequestInput,
} from '../lib/validation/auth';
import { requestPasswordReset } from '../api/auth';
import { isApiError } from '../api/errors';

const INPUT_CLASS =
  'w-full px-4 py-2.5 border border-[var(--color-border)] bg-[var(--color-bg-elevated)] rounded-xl text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-faint)] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent';

export default function PasswordResetRequestPage() {
  const { t } = useTranslation(['auth', 'common']);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PasswordResetRequestInput>({
    resolver: zodResolver(passwordResetRequestSchema),
    defaultValues: { email: '' },
    mode: 'onBlur',
  });

  const tr = (key?: string): string | undefined => (key ? t(key, { defaultValue: key }) : undefined);

  const onSubmit = async (data: PasswordResetRequestInput) => {
    setSubmitError(null);
    try {
      await requestPasswordReset({ email: data.email.trim().toLowerCase() });
      setSent(true);
    } catch (e) {
      // Backend returns 204 on every email; reaching this branch means a real
      // failure (network, 4xx on malformed body, rate-limit).
      const msg = isApiError(e)
        ? e.message
        : e instanceof Error
          ? e.message
          : t('auth:passwordReset.errors.requestFailed');
      setSubmitError(msg);
    }
  };

  return (
    <div className="min-h-screen flex">
      <LoginHeroPanel />
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-lg font-bold text-[var(--color-text-primary)]">
              {t('common:appName')}
            </span>
          </div>

          {sent ? (
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
                {t('auth:passwordReset.request.sentTitle')}
              </h1>
              <p className="text-sm text-[var(--color-text-muted)] mb-8">
                {t('auth:passwordReset.request.sentBody')}
              </p>
              <Link
                to="/login"
                className="inline-block text-sm font-medium text-primary hover:text-primary-dark"
              >
                {t('auth:passwordReset.request.backToLogin')}
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-1">
                {t('auth:passwordReset.request.title')}
              </h1>
              <p className="text-sm text-[var(--color-text-muted)] mb-8">
                {t('auth:passwordReset.request.subtitle')}
              </p>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <div>
                  <label
                    htmlFor="reset-email"
                    className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5"
                  >
                    {t('auth:passwordReset.request.emailLabel')}
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    autoComplete="email"
                    placeholder={t('auth:placeholders.email')}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'reset-email-error' : undefined}
                    className={INPUT_CLASS}
                    {...register('email')}
                  />
                  {errors.email && (
                    <p id="reset-email-error" className="text-xs text-red-600 mt-1" role="alert">
                      {tr(errors.email.message)}
                    </p>
                  )}
                </div>

                {submitError && (
                  <p className="text-sm text-red-600" role="alert">
                    {submitError}
                  </p>
                )}

                <Button type="submit" fullWidth size="lg" disabled={isSubmitting}>
                  {isSubmitting
                    ? t('auth:passwordReset.request.submitting')
                    : t('auth:passwordReset.request.submit')}
                </Button>
              </form>

              <div className="text-center mt-6">
                <Link
                  to="/login"
                  className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
                >
                  {t('auth:passwordReset.request.backToLogin')}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
