import type { TFunction } from 'i18next';
import { z } from 'zod';

import { trimmedNonEmpty } from '@/schemas/fields';

const PUNCTUATION_RE = /[~!@#$%^&*()_+`\-={}[\]|\\:";'<>,.?/]/;

export function createRegisterPhysicalSchema(t: TFunction) {
  return z
    .object({
      personalId: trimmedNonEmpty(t('validation.requiredPersonalId')),
      actualAddress: trimmedNonEmpty(t('validation.requiredActualAddress')),
      phone: z.string().trim().min(9, { message: t('validation.requiredPhone') }),
      password: z
        .string()
        .min(8, { message: t('validation.passwordTooShort') })
        .refine((v) => /[A-Z]/.test(v), { message: t('validation.passwordNoUppercase') })
        .refine((v) => /[a-z]/.test(v), { message: t('validation.passwordNoLowercase') })
        .refine((v) => /[0-9]/.test(v), { message: t('validation.passwordNoDigit') })
        .refine((v) => PUNCTUATION_RE.test(v), { message: t('validation.passwordNoPunctuation') }),
      confirmPassword: trimmedNonEmpty(t('validation.requiredConfirmPassword')),
      // optional
      legalAddress: z.string().trim().optional(),
      email: z
        .string()
        .trim()
        .optional()
        .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
          message: t('validation.invalidEmail'),
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('validation.passwordMismatch'),
      path: ['confirmPassword'],
    });
}
