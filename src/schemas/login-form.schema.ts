import { z } from 'zod';

import { FormValidationCopy } from '@/constants/form-validation-copy';
import { nonEmptyString, trimmedNonEmpty } from '@/schemas/fields';

export const loginFormSchema = z.object({
  username: trimmedNonEmpty(FormValidationCopy.requiredUsername),
  password: nonEmptyString(FormValidationCopy.requiredPassword),
});
