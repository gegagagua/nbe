import type { TFunction } from 'i18next';
import { z } from 'zod';

import { trimmedNonEmpty } from '@/schemas/fields';

export function createRegisterPhysicalSchema(t: TFunction) {
  return z
    .object({
      firstName: trimmedNonEmpty(t('validation.requiredFirstName')),
      lastName: trimmedNonEmpty(t('validation.requiredLastName')),
      personalId: trimmedNonEmpty(t('validation.requiredPersonalId')),
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
