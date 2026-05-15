import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { useForm, type UseFormRegisterReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from '../../lib/validation/auth';

const INPUT_CLASS =
  'w-full px-4 py-2.5 border border-[var(--color-border)] bg-[var(--color-bg-elevated)] rounded-xl text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-faint)] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent';

const googleEnabled = !!(import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '').trim();

type Tab = 'login' | 'register';

export default function LoginForm() {
  const { t } = useTranslation(['auth', 'common']);
  const [tab, setTab] = useState<Tab>('login');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const registerUser = useAuthStore((s) => s.register);
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);
  const showToast = useUIStore((s) => s.showToast);

  const [hydrated, setHydrated] = useState(() => useAuthStore.persist.hasHydrated());
  useEffect(() => useAuthStore.persist.onFinishHydration(() => setHydrated(true)), []);

  useEffect(() => {
    if (hydrated && isAuthenticated) navigate('/dashboard', { replace: true });
  }, [hydrated, isAuthenticated, navigate]);

  useEffect(() => {
    clearError();
  }, [tab, clearError]);

  const loginForm = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
  });

  const registerForm = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { first_name: '', last_name: '', email: '', password: '', phone_number: '' },
    mode: 'onBlur',
  });

  const submittingLogin = loginForm.formState.isSubmitting;
  const submittingRegister = registerForm.formState.isSubmitting;
  const submitting = submittingLogin || submittingRegister;

  const onLogin = async (data: LoginInput) => {
    try {
      await login(data.email, data.password);
    } catch {
      // error mirrored into store
    }
  };

  const onRegister = async (data: RegisterInput) => {
    try {
      await registerUser(
        data.first_name,
        data.last_name,
        data.email,
        data.password,
        data.phone_number?.trim() || undefined,
      );
    } catch {
      // error mirrored into store
    }
  };

  const handleGoogleSuccess = async (credential: string | undefined) => {
    if (!credential) {
      showToast(t('auth:google.failed'), 'error');
      return;
    }
    try {
      await loginWithGoogle(credential);
    } catch {
      // surfaced via store
    }
  };

  const tr = (key?: string): string | undefined => (key ? t(key, { defaultValue: key }) : undefined);

  return (
    <div className="w-full max-w-md">
      <div className="lg:hidden flex items-center gap-2 mb-8">
        <div className="w-3 h-3 rounded-full bg-primary" />
        <span className="text-lg font-bold text-[var(--color-text-primary)]">{t('common:appName')}</span>
      </div>

      <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-1">{t('auth:welcomeBack')}</h1>
      <p className="text-sm text-[var(--color-text-muted)] mb-8">{t('auth:subtitle')}</p>

      <div className="flex bg-[var(--color-bg-muted)] rounded-lg p-1 mb-6" role="tablist" aria-label="Auth mode">
        <button
          type="button"
          onClick={() => setTab('login')}
          role="tab"
          aria-selected={tab === 'login'}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
            tab === 'login'
              ? 'bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] shadow-sm'
              : 'text-[var(--color-text-muted)]'
          }`}
        >
          {t('auth:tabs.login')}
        </button>
        <button
          type="button"
          onClick={() => setTab('register')}
          role="tab"
          aria-selected={tab === 'register'}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
            tab === 'register'
              ? 'bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] shadow-sm'
              : 'text-[var(--color-text-muted)]'
          }`}
        >
          {t('auth:tabs.register')}
        </button>
      </div>

      {tab === 'login' ? (
        <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
              {t('auth:fields.email')}
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder={t('auth:placeholders.email')}
              aria-invalid={!!loginForm.formState.errors.email}
              aria-describedby={loginForm.formState.errors.email ? 'email-error' : undefined}
              className={INPUT_CLASS}
              {...loginForm.register('email')}
            />
            {loginForm.formState.errors.email && (
              <p id="email-error" className="text-xs text-red-600 mt-1" role="alert">
                {tr(loginForm.formState.errors.email.message)}
              </p>
            )}
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text-secondary)]">
                {t('auth:fields.password')}
              </label>
              <button type="button" className="text-xs text-primary hover:text-primary-dark cursor-pointer">
                {t('auth:fields.forgotPassword')}
              </button>
            </div>
            <PasswordField
              id="password"
              autoComplete="current-password"
              placeholder={t('auth:placeholders.password')}
              show={showPassword}
              setShow={setShowPassword}
              error={loginForm.formState.errors.password?.message}
              register={loginForm.register('password')}
              showLabel={t('auth:actions.showPassword')}
              hideLabel={t('auth:actions.hidePassword')}
            />
          </div>
          {error && (
            <p className="text-sm text-red-600" role="alert">{error}</p>
          )}
          <Button type="submit" fullWidth size="lg" disabled={submitting}>
            {submitting ? t('common:actions.pleaseWait') : t('auth:actions.continue')}
          </Button>
        </form>
      ) : (
        <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="first-name" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
                {t('auth:fields.firstName')}
              </label>
              <input
                id="first-name"
                type="text"
                autoComplete="given-name"
                placeholder={t('auth:placeholders.firstName')}
                aria-invalid={!!registerForm.formState.errors.first_name}
                className={INPUT_CLASS}
                {...registerForm.register('first_name')}
              />
              {registerForm.formState.errors.first_name && (
                <p className="text-xs text-red-600 mt-1" role="alert">
                  {tr(registerForm.formState.errors.first_name.message)}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="last-name" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
                {t('auth:fields.lastName')}
              </label>
              <input
                id="last-name"
                type="text"
                autoComplete="family-name"
                placeholder={t('auth:placeholders.lastName')}
                aria-invalid={!!registerForm.formState.errors.last_name}
                className={INPUT_CLASS}
                {...registerForm.register('last_name')}
              />
              {registerForm.formState.errors.last_name && (
                <p className="text-xs text-red-600 mt-1" role="alert">
                  {tr(registerForm.formState.errors.last_name.message)}
                </p>
              )}
            </div>
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
              {t('auth:fields.phone')}{' '}
              <span className="text-[var(--color-text-faint)] font-normal">{t('auth:fields.phoneOptional')}</span>
            </label>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder={t('auth:placeholders.phone')}
              aria-invalid={!!registerForm.formState.errors.phone_number}
              className={INPUT_CLASS}
              {...registerForm.register('phone_number')}
            />
            {registerForm.formState.errors.phone_number && (
              <p className="text-xs text-red-600 mt-1" role="alert">
                {tr(registerForm.formState.errors.phone_number.message)}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="reg-email" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
              {t('auth:fields.email')}
            </label>
            <input
              id="reg-email"
              type="email"
              autoComplete="email"
              placeholder={t('auth:placeholders.email')}
              aria-invalid={!!registerForm.formState.errors.email}
              className={INPUT_CLASS}
              {...registerForm.register('email')}
            />
            {registerForm.formState.errors.email && (
              <p className="text-xs text-red-600 mt-1" role="alert">
                {tr(registerForm.formState.errors.email.message)}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="reg-password" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
              {t('auth:fields.password')}
            </label>
            <PasswordField
              id="reg-password"
              autoComplete="new-password"
              placeholder={t('auth:placeholders.password')}
              show={showPassword}
              setShow={setShowPassword}
              error={registerForm.formState.errors.password?.message}
              register={registerForm.register('password')}
              showLabel={t('auth:actions.showPassword')}
              hideLabel={t('auth:actions.hidePassword')}
            />
          </div>
          {error && (
            <p className="text-sm text-red-600" role="alert">{error}</p>
          )}
          <Button type="submit" fullWidth size="lg" disabled={submitting}>
            {submitting ? t('common:actions.pleaseWait') : t('auth:actions.createAccount')}
          </Button>
        </form>
      )}

      {googleEnabled && (
        <>
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[var(--color-border)]" />
            <span className="text-xs text-[var(--color-text-faint)]">{t('auth:google.divider')}</span>
            <div className="flex-1 h-px bg-[var(--color-border)]" />
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={(r) => handleGoogleSuccess(r.credential)}
              onError={() => showToast(t('auth:google.failed'), 'error')}
              useOneTap={false}
              width="320"
            />
          </div>
        </>
      )}

      <p className="text-xs text-[var(--color-text-faint)] text-center mt-8">
        {t('auth:terms.prefix')}{' '}
        <a href="#" className="text-primary hover:underline">{t('auth:terms.tos')}</a>{' '}
        {t('auth:terms.and')}{' '}
        <a href="#" className="text-primary hover:underline">{t('auth:terms.privacy')}</a>
      </p>

      <div className="text-center mt-4">
        <Link to="/" className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]">
          {t('auth:actions.backToHome')}
        </Link>
      </div>
    </div>
  );
}

interface PasswordFieldProps {
  id: string;
  placeholder: string;
  autoComplete: 'current-password' | 'new-password';
  show: boolean;
  setShow: (v: boolean) => void;
  error?: string;
  register: UseFormRegisterReturn;
  showLabel: string;
  hideLabel: string;
}

function PasswordField({
  id,
  placeholder,
  autoComplete,
  show,
  setShow,
  error,
  register,
  showLabel,
  hideLabel,
}: PasswordFieldProps) {
  const errorId = error ? `${id}-error` : undefined;
  return (
    <>
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className={`${INPUT_CLASS} pr-10`}
          {...register}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-faint)] hover:text-[var(--color-text-muted)] cursor-pointer"
          aria-label={show ? hideLabel : showLabel}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && (
        <p id={errorId} className="text-xs text-red-600 mt-1" role="alert">
          {error.startsWith('auth:') || error.includes(':') ? '' : ''}
          {/* The message is an i18n key; resolve via t() in caller is awkward here, so resolve via i18next directly */}
          <I18nMessage value={error} />
        </p>
      )}
    </>
  );
}

function I18nMessage({ value }: { value: string }) {
  const { t } = useTranslation('auth');
  return <>{t(value, { defaultValue: value })}</>;
}
