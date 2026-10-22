import type { TFunction } from 'i18next';
import { z } from 'zod';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type LegalEntityDetailsValues = {
  realAddress: string;
  email: string;
};

export function createLegalEntityDetailsSchema(t: TFunction) {
  return z.object({
    realAddress: z.string().trim().min(1, { message: t('validation.requiredActualAddress') }),
    email: z
      .string()
      .trim()
      .refine((v) => !v || EMAIL_RE.test(v), { message: t('validation.invalidEmail') }),
  });
}
