import { z } from 'zod';

import { FormValidationCopy } from '@/constants/form-validation-copy';
import { trimmedNonEmpty } from '@/schemas/fields';

export const registerPhysicalSchema = z
  .object({
    firstName: trimmedNonEmpty(FormValidationCopy.requiredFirstName),
    lastName: trimmedNonEmpty(FormValidationCopy.requiredLastName),
    personalId: trimmedNonEmpty(FormValidationCopy.requiredPersonalId),
    email: z
      .string()
      .trim()
      .min(1, { message: FormValidationCopy.required })
      .email({ message: FormValidationCopy.invalidEmail }),
    phone: z
      .string()
      .trim()
      .min(9, { message: FormValidationCopy.requiredPhone }),
    password: trimmedNonEmpty(FormValidationCopy.requiredPassword),
    confirmPassword: trimmedNonEmpty(FormValidationCopy.requiredConfirmPassword),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: FormValidationCopy.passwordMismatch,
    path: ['confirmPassword'],
  });
