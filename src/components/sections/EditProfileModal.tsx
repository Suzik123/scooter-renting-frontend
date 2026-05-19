import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import Button from '../ui/Button';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import { updateUser } from '../../api/users';
import { isApiError } from '../../api/errors';
import { editProfileSchema, type EditProfileInput } from '../../lib/validation/auth';

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
}

const INPUT_CLASS =
  'w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-faint)] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent';

export default function EditProfileModal({ open, onClose }: EditProfileModalProps) {
  const { t } = useTranslation(['profile', 'auth', 'common']);
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const showToast = useUIStore((s) => s.showToast);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileInput>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      first_name: user?.first_name ?? '',
      last_name: user?.last_name ?? '',
      phone_number: user?.phone_number ?? '',
    },
    mode: 'onBlur',
  });

  // Re-seed the form whenever the modal (re-)opens with the latest user values.
  useEffect(() => {
    if (!open) return;
    setSubmitError(null);
    reset({
      first_name: user?.first_name ?? '',
      last_name: user?.last_name ?? '',
      phone_number: user?.phone_number ?? '',
    });
  }, [open, user, reset]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open || !user) return null;

  const tr = (key?: string): string | undefined => (key ? t(key, { defaultValue: key }) : undefined);

  const onSubmit = async (data: EditProfileInput) => {
    setSubmitError(null);
    try {
      const updated = await updateUser(user.user_id, {
        first_name: data.first_name.trim(),
        last_name: (data.last_name ?? '').trim() || undefined,
        phone_number: (data.phone_number ?? '').trim() || undefined,
      });
      setUser(updated);
      showToast(t('profile:editProfile.saved'), 'success');
      onClose();
    } catch (e) {
      const msg = isApiError(e)
        ? e.message
        : e instanceof Error
          ? e.message
          : t('profile:editProfile.saveFailed');
      setSubmitError(msg);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[var(--color-overlay)] p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-profile-title"
      onClick={onClose}
    >
      <div
        className="bg-[var(--color-surface)] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-xl max-h-[90vh] overflow-y-auto border border-[var(--color-border)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-border-muted)]">
          <h2 id="edit-profile-title" className="text-lg font-bold text-[var(--color-text-primary)]">
            {t('profile:editProfile.title')}
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

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4" noValidate>
          <div>
            <label
              htmlFor="edit-first-name"
              className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5"
            >
              {t('auth:fields.firstName')}
            </label>
            <input
              id="edit-first-name"
              type="text"
              autoComplete="given-name"
              aria-invalid={!!errors.first_name}
              aria-describedby={errors.first_name ? 'edit-first-name-error' : undefined}
              className={INPUT_CLASS}
              {...register('first_name')}
            />
            {errors.first_name && (
              <p id="edit-first-name-error" className="text-xs text-red-600 mt-1" role="alert">
                {tr(errors.first_name.message)}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="edit-last-name"
              className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5"
            >
              {t('auth:fields.lastName')}{' '}
              <span className="text-[var(--color-text-faint)] font-normal">{t('auth:fields.phoneOptional')}</span>
            </label>
            <input
              id="edit-last-name"
              type="text"
              autoComplete="family-name"
              aria-invalid={!!errors.last_name}
              className={INPUT_CLASS}
              {...register('last_name')}
            />
            {errors.last_name && (
              <p className="text-xs text-red-600 mt-1" role="alert">
                {tr(errors.last_name.message)}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="edit-phone"
              className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5"
            >
              {t('auth:fields.phone')}{' '}
              <span className="text-[var(--color-text-faint)] font-normal">{t('auth:fields.phoneOptional')}</span>
            </label>
            <input
              id="edit-phone"
              type="tel"
              autoComplete="tel"
              aria-invalid={!!errors.phone_number}
              className={INPUT_CLASS}
              {...register('phone_number')}
            />
            {errors.phone_number && (
              <p className="text-xs text-red-600 mt-1" role="alert">
                {tr(errors.phone_number.message)}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="edit-email"
              className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5"
            >
              {t('auth:fields.email')}
            </label>
            <input
              id="edit-email"
              type="email"
              value={user.email}
              disabled
              readOnly
              aria-readonly="true"
              className={`${INPUT_CLASS} opacity-60 cursor-not-allowed`}
            />
            <p className="text-xs text-[var(--color-text-faint)] mt-1">
              {t('profile:editProfile.emailReadOnly')}
            </p>
          </div>

          {submitError && (
            <p className="text-sm text-red-600" role="alert">
              {submitError}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" fullWidth onClick={onClose} disabled={isSubmitting}>
              {t('common:actions.cancel')}
            </Button>
            <Button type="submit" fullWidth disabled={isSubmitting}>
              {isSubmitting ? t('common:actions.pleaseWait') : t('common:actions.save')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
