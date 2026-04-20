import { z } from 'zod';

export function trimmedNonEmpty(message: string) {
  return z.string().trim().min(1, { message });
}

export function nonEmptyString(message: string) {
  return z.string().min(1, { message });
}
