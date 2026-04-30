import { z } from 'zod';

import { registerLegalSchema } from '@/schemas/register-legal.schema';
import { registerPhysicalSchema } from '@/schemas/register-physical.schema';

export type RegisterPhysicalValues = z.infer<typeof registerPhysicalSchema>;
export type RegisterLegalValues = z.infer<typeof registerLegalSchema>;
