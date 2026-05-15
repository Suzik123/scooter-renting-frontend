import { z } from 'zod';

/**
 * Offline payment approval. Decimal field travels as a string to preserve
 * precision — keep that contract here.
 */
export const offlinePaymentSchema = z.object({
  rental_id: z
    .string()
    .min(1, 'ride:admin.validation.rentalIdRequired')
    .uuid('ride:admin.validation.rentalIdInvalid'),
  amount: z
    .string()
    .min(1, 'ride:admin.validation.amountRequired')
    .refine((v) => {
      const n = Number(v);
      return Number.isFinite(n) && n > 0;
    }, 'ride:admin.validation.amountInvalid'),
  currency: z
    .string()
    .trim()
    .length(3, 'ride:admin.validation.currencyInvalid')
    .transform((s) => s.toUpperCase()),
  note: z.string().max(500, 'ride:admin.validation.noteTooLong').optional(),
  idempotency_key: z.string().uuid(),
});

export type OfflinePaymentInput = z.infer<typeof offlinePaymentSchema>;
