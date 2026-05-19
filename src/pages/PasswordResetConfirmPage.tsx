import { useEffect, useMemo, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button';
import LoginHeroPanel from '../components/sections/LoginHeroPanel';
import { useUIStore } from '../stores/uiStore';
import {
  passwordResetConfirmSchema,
  type PasswordResetConfirmInput,
} from '../lib/validation/auth';
import { confirmPasswordReset } from '../api/auth';
import { isApiError } from '../api/errors';

const INPUT_CLASS =
  'w-full px-4 py-2.5 border border-[var(--color-border)] bg-[var(--color-bg-elevated)] rounded-xl text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-faint)] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent';

export default function PasswordResetConfirmPage() {
  const { t } = useTranslation(['auth', 'common']);
  const navigate = useNavigate();
  const showToast = useUIStore((s) => s.showToast);
  const [params] = useSearchParams();
  const token = useMemo(() => params.get('token') ?? '', [params]);
  const [showPassword, setShowPassword] = useState(false);
  const [expired, setExpired] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PasswordResetConfirmInput>({
    resolver: zodResolver(passwordResetConfirmSchema),
    defaultValues: { token: '', new_password: '', confirm_password: '' },
    mode: 'onBlur',
  });

  useEffect(() => {
    setValue('token', token);
  }, [token, setValue]);

  // No token in URL → bounce to the request page rather than render an empty form.
  if (!token) {
    return <Navigate to="/password-reset" replace />;
  }

  const tr = (key?: string): string | undefined => (key ? t(key, { defaultValue: key }) : undefined);

  const onSubmit = async (data: PasswordResetConfirmInput) => {
    setSubmitError(null);
    setExpired(false);
    try {
      await confirmPasswordReset({ token: data.token, new_password: data.new_password });
      showToast(t('auth:passwordReset.confirm.successToast'), 'success');
      navigate('/login', { replace: true });
    } catch (e) {
      if (isApiError(e) && (e.status === 401 || e.kind === 'invalid_token')) {
        setExpired(true);
        return;
      }
      const msg = isApiError(e)
        ? e.message
        : e instanceof Error
          ? e.message
          : t('auth:passwordReset.errors.confirmFailed');
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

          {expired ? (
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
                {t('auth:passwordReset.confirm.expiredTitle')}
              </h1>
              <p className="text-sm text-[var(--color-text-muted)] mb-6">
                {t('auth:passwordReset.confirm.expiredBody')}
              </p>
              <Link
                to="/password-reset"
                className="inline-block text-sm font-medium text-primary hover:text-primary-dark"
              >
                {t('auth:passwordReset.confirm.requestNew')}
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-1">
                {t('auth:passwordReset.confirm.title')}
              </h1>
              <p className="text-sm text-[var(--color-text-muted)] mb-8">
                {t('auth:passwordReset.confirm.subtitle')}
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <input type="hidden" {...register('token')} />

                <div>
                  <label
                    htmlFor="new-password"
                    className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5"
                  >
                    {t('auth:passwordReset.confirm.newPasswordLabel')}
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder={t('auth:placeholders.password')}
                      aria-invalid={!!errors.new_password}
                      aria-describedby={errors.new_password ? 'new-password-error' : undefined}
                      className={`${INPUT_CLASS} pr-10`}
                      {...register('new_password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-faint)] hover:text-[var(--color-text-muted)] cursor-pointer"
                      aria-label={showPassword ? t('auth:actions.hidePassword') : t('auth:actions.showPassword')}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.new_password && (
                    <p id="new-password-error" className="text-xs text-red-600 mt-1" role="alert">
                      {tr(errors.new_password.message)}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5"
                  >
                    {t('auth:passwordReset.confirm.confirmPasswordLabel')}
                  </label>
                  <input
                    id="confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder={t('auth:placeholders.password')}
                    aria-invalid={!!errors.confirm_password}
                    aria-describedby={errors.confirm_password ? 'confirm-password-error' : undefined}
                    className={INPUT_CLASS}
                    {...register('confirm_password')}
                  />
                  {errors.confirm_password && (
                    <p id="confirm-password-error" className="text-xs text-red-600 mt-1" role="alert">
                      {tr(errors.confirm_password.message)}
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
                    ? t('auth:passwordReset.confirm.submitting')
                    : t('auth:passwordReset.confirm.submit')}
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
