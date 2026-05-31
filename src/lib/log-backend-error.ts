import { logApiError } from '@/lib/api-log';

export function logBackendError(error: unknown, context?: string): void {
  logApiError(error, context);
}
