import type { z } from 'zod';

import type { createRegisterLegalSchema } from '@/schemas/register-legal.schema';
import type { createRegisterPhysicalSchema } from '@/schemas/register-physical.schema';

export type RegisterPhysicalValues = z.infer<ReturnType<typeof createRegisterPhysicalSchema>>;
export type RegisterLegalValues = z.infer<ReturnType<typeof createRegisterLegalSchema>>;
