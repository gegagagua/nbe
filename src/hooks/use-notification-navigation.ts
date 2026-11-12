import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect } from 'react';

import { logPushPayload } from '@/lib/push-log';

/**
 * Reads the `notificationId` a notification carries (see
 * {@link sendTestNotification}) and opens its detail at `/notifications/[id]`,
 * which links on to the case. Without an id it opens the notifications feed.

 */
function openNotificationFromResponse(
  response: Notifications.NotificationResponse | null,
) {
  if (!response) {
    return;
  }
  logPushPayload('tapped', response.notification);
  const data = response.notification.request.content.data as
    | { notificationId?: number | string }
    | undefined;
  if (data?.notificationId == null) {
    router.push('/notifications');
    return;
  }
  router.push({
    pathname: '/notifications/[id]',
    params: { id: String(data.notificationId) },
  });
}

/**
 * Wires notification taps to navigation. Handles both the app-already-running
 * case (listener) and a cold start where the app was launched by tapping the
 * notification (last-response check). Mount once, near the navigation root.
 */
export function useNotificationNavigation() {
  useEffect(() => {
    Notifications.getLastNotificationResponseAsync().then(
      openNotificationFromResponse,
    );

    const subscription =
      Notifications.addNotificationResponseReceivedListener(
        openNotificationFromResponse,
      );
    const receivedSubscription = Notifications.addNotificationReceivedListener(
      (notification) => logPushPayload('received', notification),
    );
    return () => {
      subscription.remove();
      receivedSubscription.remove();
    };
  }, []);
}
