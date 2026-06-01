import type { TFunction } from 'i18next';
import { z } from 'zod';

export function createForgotPasswordIdentitySchema(t: TFunction) {
  return z.object({
    username: z.string().trim().min(1, { message: t('validation.requiredUsername') }),
  });
}

export function createOtpSchema(t: TFunction) {
  return z.object({
    code: z
      .string()
      .length(6, { message: t('validation.requiredOtp') })
      .regex(/^\d{6}$/, { message: t('validation.requiredOtp') }),
  });
}

export type ForgotPasswordIdentityValues = z.infer<
  ReturnType<typeof createForgotPasswordIdentitySchema>
>;
export type OtpFormValues = z.infer<ReturnType<typeof createOtpSchema>>;
