import type { AppNotification, NotificationDto } from '@/types/notifications';

/** Formats an ISO datetime as `dd.MM.yy`, matching the notification card design. */
function formatNotificationDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return iso;
  }
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${String(d.getFullYear()).slice(-2)}`;
}

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
    caseNumber: dto.regnumber ?? '',
    appId: dto.appId,
    body: stripHtml(dto.notifText ?? ''),
    date: formatNotificationDate(dto.createdDate),
    isRead: dto.read,
  };
}
