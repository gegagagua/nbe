import type { AppNotification } from '@/types/notifications';

/**
 * Sample notification used by the "Test push" button on the home screen. Mirrors
 * the shape a real row from the feed has (see {@link AppNotification}) so the
 * pushed content matches what the notifications list renders.
 */
export const mockPushNotification: AppNotification = {
  id: 999001,
  title: 'ახალი შეტყობინება',
  module: 'აღსრულების ეროვნული ბიურო',
  caseNumber: 'A23022853',
  appId: 23022853,
  body: 'თქვენს საქმეზე დაფიქსირდა ცვლილება. გთხოვთ, გაეცნოთ დეტალებს შეტყობინებების გვერდზე.',
  receivedAt: '17.09.2026 12:11:17',
  isRead: false,
};
