import type { TFunction } from 'i18next';
import { z } from 'zod';

import { trimmedNonEmpty } from '@/schemas/fields';

export function createRegisterLegalSchema(t: TFunction) {
  return z
    .object({
      companyName: trimmedNonEmpty(t('validation.requiredCompanyName')),
      identificationCode: trimmedNonEmpty(t('validation.requiredIdentificationCode')),
      representativeName: trimmedNonEmpty(t('validation.requiredRepresentative')),
      email: z
        .string()
        .trim()
        .min(1, { message: t('validation.required') })
        .email({ message: t('validation.invalidEmail') }),
      phone: z.string().trim().min(9, { message: t('validation.requiredPhone') }),
      password: trimmedNonEmpty(t('validation.requiredPassword')),
      confirmPassword: trimmedNonEmpty(t('validation.requiredConfirmPassword')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('validation.passwordMismatch'),
      path: ['confirmPassword'],
    });
}
