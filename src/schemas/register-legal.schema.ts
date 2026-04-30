import { z } from 'zod';

import { FormValidationCopy } from '@/constants/form-validation-copy';
import { trimmedNonEmpty } from '@/schemas/fields';

export const registerLegalSchema = z
  .object({
    companyName: trimmedNonEmpty(FormValidationCopy.requiredCompanyName),
    identificationCode: trimmedNonEmpty(
      FormValidationCopy.requiredIdentificationCode,
    ),
    representativeName: trimmedNonEmpty(FormValidationCopy.requiredRepresentative),
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
