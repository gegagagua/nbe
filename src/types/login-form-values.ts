import type { z } from 'zod';

import { loginFormSchema } from '@/schemas/login-form.schema';

export type LoginFormValues = z.infer<typeof loginFormSchema>;
