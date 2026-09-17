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
  return {
    id: dto.id,
    title: dto.notifType?.name ?? '',
    module: dto.sysModule?.name ?? '',
    caseNumber: dto.regnumber ?? '',
    appId: dto.appId,
    body: stripHtml(dto.notifText ?? ''),
    receivedAt: formatEnforcementDateTime(dto.createdDate),
    isRead: dto.read,
  };
}
