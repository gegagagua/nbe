import type { TFunction } from 'i18next';
import { z } from 'zod';

const PUNCTUATION_RE = /[~!@#$%^&*()_+`\-={}[\]|\\:";'<>,.?/]/;

export function createPhoneSchema(t: TFunction) {
  return z.object({
    phone: z
      .string()
      .trim()
      .min(1, { message: t('validation.requiredPhone') }),
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

export function createNewPasswordSchema(t: TFunction) {
  return z
    .object({
      password: z
        .string()
        .min(8, { message: t('validation.passwordTooShort') })
        .refine((v) => /[A-Z]/.test(v), { message: t('validation.passwordNoUppercase') })
        .refine((v) => /[a-z]/.test(v), { message: t('validation.passwordNoLowercase') })
        .refine((v) => /[0-9]/.test(v), { message: t('validation.passwordNoDigit') })
        .refine((v) => PUNCTUATION_RE.test(v), { message: t('validation.passwordNoPunctuation') }),
      confirmPassword: z.string().min(1, { message: t('validation.requiredConfirmPassword') }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('validation.passwordMismatch'),
      path: ['confirmPassword'],
    });
}

export type PhoneFormValues = z.infer<ReturnType<typeof createPhoneSchema>>;
export type OtpFormValues = z.infer<ReturnType<typeof createOtpSchema>>;
export type NewPasswordFormValues = z.infer<ReturnType<typeof createNewPasswordSchema>>;
