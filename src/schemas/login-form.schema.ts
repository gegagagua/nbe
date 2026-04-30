import type { TFunction } from 'i18next';
import { z } from 'zod';

import { nonEmptyString, trimmedNonEmpty } from '@/schemas/fields';

export function createLoginFormSchema(t: TFunction) {
  return z.object({
    username: trimmedNonEmpty(t('validation.requiredUsername')),
    password: nonEmptyString(t('validation.requiredPassword')),
  });
}
