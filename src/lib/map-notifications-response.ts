import { resolveNotificationModule } from '@/lib/resolve-notification-module';
import type { AppNotification, NotificationDto } from '@/types/notifications';
import { formatEnforcementDateTime } from '@/utils/format-enforcement-datetime';

/** Strips HTML tags (the body arrives wrapped in `<pre>…</pre>`) and collapses whitespace. */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function mapNotification(dto: NotificationDto): AppNotification {
  const regnumber = dto.regnumber ?? '';
  return {
    id: dto.id,
    title: dto.notifType?.name ?? '',
    module: resolveNotificationModule(regnumber),
    caseNumber: regnumber,
    appId: dto.appId,
    body: stripHtml(dto.notifText ?? ''),
    receivedAt: formatEnforcementDateTime(dto.createdDate),
    isRead: dto.read,
  };
}
