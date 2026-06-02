import type { TFunction } from 'i18next';
import { z } from 'zod';

import { trimmedNonEmpty } from '@/schemas/fields';
import type { GuestPersonType } from '@/types/guest-fine';

const PERSONAL_ID_RE = /^\d{11}$/;

export type GuestFineCheckFormValues = {
  personType: GuestPersonType;
  idNumber: string;
  documentNumber: string;
};

export function createGuestFineCheckSchema(t: TFunction) {
  return z
    .object({
      personType: z.enum(['physical', 'legal']),
      idNumber: trimmedNonEmpty(t('cases.guestFine.requiredIdNumber')),
      documentNumber: trimmedNonEmpty(t('cases.guestFine.requiredDocumentNumber')),
    })
    .superRefine((data, ctx) => {
      if (data.personType === 'physical' && !PERSONAL_ID_RE.test(data.idNumber)) {
        ctx.addIssue({
          code: 'custom',
          message: t('validation.invalidPersonalId'),
          path: ['idNumber'],
        });
      }
    });
}
