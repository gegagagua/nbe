import type { NotificationModule } from '@/types/notifications';

/**
 * Infers the app module a notification belongs to from its case number prefix:
 * enforcement cases are `A…`, statement-of-facts cases are `F…`. Anything else
 * is treated as `other` (label hidden).
 *
 * TODO: switch to an explicit module field if the backend adds one to the
 * notification payload.
 */
export function resolveNotificationModule(regnumber: string): NotificationModule {
  const prefix = regnumber.trim().charAt(0).toUpperCase();
  if (prefix === 'A') {
    return 'enforcement';
  }
  if (prefix === 'F') {
    return 'facts';
  }
  return 'other';
}
