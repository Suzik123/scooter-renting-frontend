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
