import type { TFunction } from 'i18next';
import { z } from 'zod';

const PHONE_RE = /^(\d{9}|995\d{9})$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ProfileInfoEditValues = {
  realAddress: string;
  legalAddress: string;
  phone: string;
  email: string;
};

function optionalPhone(t: TFunction) {
  return z
    .string()
    .trim()
    .refine((v) => !v || PHONE_RE.test(v), { message: t('validation.invalidPhone') });
}

function optionalEmail(t: TFunction) {
  return z
    .string()
    .trim()
    .refine((v) => !v || EMAIL_RE.test(v), { message: t('validation.invalidEmail') });
}

export function createProfileInfoEditSchema(t: TFunction) {
  return z.object({
    realAddress: z.string().trim(),
    legalAddress: z.string().trim(),
    phone: optionalPhone(t),
    email: optionalEmail(t),
  });
}
