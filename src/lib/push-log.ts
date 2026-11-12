import type { Notification } from 'expo-notifications';

export function logPushPayload(source: 'received' | 'tapped', notification: Notification): void {
  if (!__DEV__) return;
  const { content, trigger } = notification.request;
  console.log(`[PUSH ${source}]`, JSON.stringify({ content, trigger }, null, 2));
}
