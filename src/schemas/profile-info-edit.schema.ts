import type { TFunction } from 'i18next';
import { z } from 'zod';

import { trimmedNonEmpty } from '@/schemas/fields';

export type ProfileInfoEditValues = {
  firstName: string;
  lastName: string;
  address: string;
};

export function createProfileInfoEditSchema(t: TFunction) {
  return z.object({
    firstName: trimmedNonEmpty(t('validation.requiredFirstName')),
    lastName: trimmedNonEmpty(t('validation.requiredLastName')),
    address: trimmedNonEmpty(t('validation.requiredActualAddress')),
  });
}
