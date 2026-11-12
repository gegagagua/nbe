import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { registerPushDevice } from '@/api/notifications';
import { resolveDeviceName } from '@/lib/device-info';
import { getOrCreateInstallationId } from '@/lib/passkey-storage';

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
 * Fetches this device's Expo push token and registers it for `userId` on the
 * backend. Returns `false` when no token is available (web, simulator, denied
 * permission); network errors are thrown to the caller.
 */
export async function syncPushDeviceRegistration(
  userId: number | string,
): Promise<boolean> {
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
    return false;
  }
  const expoPushToken = await registerForPushNotificationsAsync();
  if (!expoPushToken) {
    return false;
  }
  await registerPushDevice(userId, {
    installationId: await getOrCreateInstallationId(),
    expoPushToken,
    platform: Platform.OS === 'ios' ? 'IOS' : 'ANDROID',
    deviceName: resolveDeviceName(),
  });
  return true;
}
