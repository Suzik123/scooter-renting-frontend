import { z } from 'zod';

/**
 * Login schema. Mirrors backend constraints:
 *   - email must parse with the standard RFC validation.
 *   - password length matches backend bcrypt input bounds (8–128).
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'auth:validation.emailRequired')
    .email('auth:validation.emailInvalid'),
  password: z
    .string()
    .min(1, 'auth:validation.passwordRequired')
    .min(8, 'auth:validation.passwordTooShort')
    .max(128, 'auth:validation.passwordTooLong'),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Registration schema. Phone is optional but, when provided, must be
 * roughly E.164-shaped: optional `+`, 7–15 digits, common separators allowed.
 */
export const registerSchema = z.object({
  first_name: z.string().trim().min(1, 'auth:validation.firstNameRequired').max(100),
  last_name: z.string().trim().min(1, 'auth:validation.lastNameRequired').max(100),
  email: z
    .string()
    .min(1, 'auth:validation.emailRequired')
    .email('auth:validation.emailInvalid'),
  password: z
    .string()
    .min(1, 'auth:validation.passwordRequired')
    .min(8, 'auth:validation.passwordTooShort')
    .max(128, 'auth:validation.passwordTooLong'),
  phone_number: z
    .string()
    .trim()
    .optional()
    .refine(
      (v) => !v || /^\+?[0-9\s\-().]{7,20}$/.test(v),
      'auth:validation.phoneInvalid',
    ),
});

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Edit profile schema. Email is intentionally not editable in v1 (no backend
 * verify-new-email flow). Mirrors the phone regex used on register.
 */
export const editProfileSchema = z.object({
  first_name: z.string().trim().min(1, 'auth:validation.firstNameRequired').max(100),
  last_name: z.string().trim().max(100).optional().or(z.literal('')),
  phone_number: z
    .string()
    .trim()
    .optional()
    .or(z.literal(''))
    .refine(
      (v) => !v || /^\+?[0-9\s\-().]{7,20}$/.test(v),
      'auth:validation.phoneInvalid',
    ),
});

export type EditProfileInput = z.infer<typeof editProfileSchema>;

/**
 * Password reset request: just an email — server returns 204 either way to
 * prevent user enumeration. We normalize to lowercase before submitting.
 */
export const passwordResetRequestSchema = z.object({
  email: z
    .string()
    .min(1, 'auth:validation.emailRequired')
    .email('auth:validation.emailInvalid'),
});

export type PasswordResetRequestInput = z.infer<typeof passwordResetRequestSchema>;

/**
 * Password reset confirm: a token (from the email link) plus a new password
 * matching the same policy as registration. `confirm_password` is purely
 * client-side; we strip it before submitting.
 */
export const passwordResetConfirmSchema = z
  .object({
    token: z.string().min(1, 'auth:passwordReset.errors.tokenMissing'),
    new_password: z
      .string()
      .min(1, 'auth:validation.passwordRequired')
      .min(8, 'auth:validation.passwordTooShort')
      .max(128, 'auth:validation.passwordTooLong'),
    confirm_password: z.string().min(1, 'auth:validation.passwordRequired'),
  })
  .refine((d) => d.new_password === d.confirm_password, {
    path: ['confirm_password'],
    message: 'auth:passwordReset.errors.mismatch',
  });

export type PasswordResetConfirmInput = z.infer<typeof passwordResetConfirmSchema>;
