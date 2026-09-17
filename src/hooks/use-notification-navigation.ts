import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect } from 'react';

/**
 * Reads the `appId` a notification carries (see {@link sendTestNotification})
 * and opens the matching enforcement proceeding at `/cases/[id]` — the same
 * destination the in-app notification detail links to.
 */
function openCaseFromResponse(
  response: Notifications.NotificationResponse | null,
) {
  const data = response?.notification.request.content.data as
    | { appId?: number | string }
    | undefined;
  if (data?.appId == null) {
    return;
  }
  router.push({
    pathname: '/cases/[id]',
    params: { id: String(data.appId) },
  });
}

/**
 * Wires notification taps to navigation. Handles both the app-already-running
 * case (listener) and a cold start where the app was launched by tapping the
 * notification (last-response check). Mount once, near the navigation root.
 */
export function useNotificationNavigation() {
  useEffect(() => {
    Notifications.getLastNotificationResponseAsync().then(openCaseFromResponse);

    const subscription =
      Notifications.addNotificationResponseReceivedListener(
        openCaseFromResponse,
      );
    return () => subscription.remove();
  }, []);
}
