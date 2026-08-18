import type { AppNotification } from '@/types/notifications';

const previewBody =
  'თქვენი მონაწილეობით დაიწყო სააღსრულებო წარმოება, გთხოვთ გაეცნოთ დეტალებს პირად კაბინეტში.';

/**
 * Placeholder feed used until the notifications endpoint is wired up.
 * Titles/bodies are server-owned content, so they live here as data rather
 * than in the i18n fragments.
 */
export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 1,
    title: 'ახალი სააღსრულებო საქმე',
    caseNumber: 'A24006642',
    body: previewBody,
    date: '18.03.24',
    isRead: false,
    category: 'newCase',
  },
  {
    id: 2,
    title: 'საქმის სტატუსი შეიცვალა',
    caseNumber: 'A24006642',
    body: previewBody,
    date: '16.03.24',
    isRead: true,
    category: 'statusChange',
  },
  {
    id: 3,
    title: 'საქმის სტატუსი შეიცვალა',
    caseNumber: 'A24006642',
    body: previewBody,
    date: '16.03.24',
    isRead: true,
    category: 'statusChange',
  },
  {
    id: 4,
    title: 'საქმის სტატუსი შეიცვალა',
    caseNumber: 'A24006642',
    body: previewBody,
    date: '14.03.24',
    isRead: true,
    category: 'statusChange',
  },
  {
    id: 5,
    title: 'ახალი სააღსრულებო საქმე',
    caseNumber: 'A24006642',
    body: previewBody,
    date: '13.03.24',
    isRead: false,
    category: 'newCase',
  },
  {
    id: 6,
    title: 'ახალი სააღსრულებო საქმე',
    caseNumber: 'A24006642',
    body: previewBody,
    date: '10.03.24',
    isRead: false,
    category: 'newCase',
  },
  {
    id: 7,
    title: 'ახალი სააღსრულებო საქმე',
    caseNumber: 'A24006642',
    body: previewBody,
    date: '8.03.24',
    isRead: false,
    category: 'newCase',
  },
];
