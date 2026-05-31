import type { TFunction } from 'i18next';
import { z } from 'zod';

import { trimmedNonEmpty } from '@/schemas/fields';

const PUNCTUATION_RE = /[~!@#$%^&*()_+`\-={}[\]|\\:";'<>,.?/]/;
const PERSONAL_ID_RE = /^\d{11}$/;
const PHONE_RE = /^\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function createRegisterPhysicalSchema(t: TFunction) {
  return z
    .object({
      personalId: trimmedNonEmpty(t('validation.requiredPersonalId')).refine(
        (v) => PERSONAL_ID_RE.test(v),
        { message: t('validation.invalidPersonalId') },
      ),
      actualAddress: trimmedNonEmpty(t('validation.requiredActualAddress')),
      phone: trimmedNonEmpty(t('validation.requiredPhone')).refine(
        (v) => PHONE_RE.test(v),
        { message: t('validation.invalidPhone') },
      ),
      password: z
        .string()
        .min(8, { message: t('validation.passwordTooShort') })
        .refine((v) => /[A-Z]/.test(v), { message: t('validation.passwordNoUppercase') })
        .refine((v) => /[a-z]/.test(v), { message: t('validation.passwordNoLowercase') })
        .refine((v) => /[0-9]/.test(v), { message: t('validation.passwordNoDigit') })
        .refine((v) => PUNCTUATION_RE.test(v), { message: t('validation.passwordNoPunctuation') }),
      confirmPassword: trimmedNonEmpty(t('validation.requiredConfirmPassword')),
      legalAddress: z.string().trim().optional(),
      email: z
        .string()
        .trim()
        .optional()
        .refine((v) => !v || EMAIL_RE.test(v), {
          message: t('validation.invalidEmail'),
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('validation.passwordMismatch'),
      path: ['confirmPassword'],
    });
}
