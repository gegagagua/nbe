import { Asset } from 'expo-asset';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import type { AppNotification } from '@/types/notifications';
import { formatEnforcementDateTime } from '@/utils/format-enforcement-datetime';

// App logo shown alongside the notification (iOS attachment / Android large icon).
const appLogo = require('../../assets/images/logo.png');

/** Resolves the bundled app logo to a local file URI, or null if unavailable. */
async function getAppLogoUri(): Promise<string | null> {
  try {
    const asset = Asset.fromModule(appLogo);
    if (!asset.localUri) {
      await asset.downloadAsync();
    }
    return asset.localUri ?? asset.uri ?? null;
  } catch {
    return null;
  }
}

// Show an alert + play a sound even when the app is in the foreground, so a
// pushed notification is visible right away while testing.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Requests notification permission (and, on Android, sets up the default
 * channel). Returns `true` when notifications are allowed. Safe to call multiple
 * times — the OS only prompts once.
 */
export async function ensureNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#208AEF',
    });
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  let status = existing;
  if (status !== 'granted') {
    const request = await Notifications.requestPermissionsAsync();
    status = request.status;
  }
  return status === 'granted';
}

/**
 * Registers for remote (Expo) push notifications and returns the Expo push
 * token, or `null` if unavailable (e.g. simulator, web, or denied permission).
 * The token is what a server would send to https://exp.host to deliver a push.
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!Device.isDevice) {
    return null;
  }

  const granted = await ensureNotificationPermission();
  if (!granted) {
    return null;
  }

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;
  if (!projectId) {
    return null;
  }

  try {
    const token = await Notifications.getExpoPushTokenAsync({ projectId });
    return token.data;
  } catch {
    return null;
  }
}

/**
 * Schedules an immediate local notification built from an {@link AppNotification}
 * so it renders with the same title/body the notifications feed shows. Used by
 * the home-screen "Test push" button. Returns whether it was scheduled.
 */
export async function sendTestNotification(
  notification: AppNotification,
): Promise<boolean> {
  const granted = await ensureNotificationPermission();
  if (!granted) {
    return false;
  }

  // Stamp the moment we send so the notification shows its own delivery time.
  const sentAt = formatEnforcementDateTime(new Date().toISOString());
  const sentDate = sentAt.split(' ')[0];
  const logoUri = await getAppLogoUri();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${notification.title} · ${sentDate}`,
      subtitle: notification.module,
      body: `${notification.body}\n\nგამოგზავნის დრო: ${sentAt}`,
      data: {
        notificationId: notification.id,
        caseNumber: notification.caseNumber,
        appId: notification.appId,
        sentAt,
      },
      sound: true,
      // Android tints the app logo (the monochrome notification icon set in the
      // expo-notifications config plugin) with this accent color.
      color: '#208AEF',
      // iOS: attach the app logo so it renders next to the notification.
      attachments: logoUri
        ? [{ identifier: 'app-logo', url: logoUri, type: 'image/png' }]
        : undefined,
    },
    // null trigger = fire as soon as possible.
    trigger: null,
  });
  return true;
}
