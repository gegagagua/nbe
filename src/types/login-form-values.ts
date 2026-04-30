import type { z } from 'zod';

import type { createLoginFormSchema } from '@/schemas/login-form.schema';

export type LoginFormValues = z.infer<ReturnType<typeof createLoginFormSchema>>;
