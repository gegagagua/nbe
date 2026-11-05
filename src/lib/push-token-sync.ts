import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { registerPushToken } from '@/api/notifications';
import { PushTokenSyncedStorageKey } from '@/constants/api';
import { getOrCreateInstallationId } from '@/lib/passkey-storage';
import { registerForPushNotificationsAsync } from '@/lib/push-notifications';

let inFlight = false;

/**
 * Obtains the Expo push token (prompting for notification permission if
 * needed) and registers it with the backend. Safe to call on every dashboard
 * mount: a token already registered by this install is skipped, failures are
 * swallowed and simply retried on the next call. Must only run with a live
 * session — the register endpoint is authenticated.
 */
export async function syncPushTokenToBackend(): Promise<void> {
  if (Platform.OS === 'web' || inFlight) return;
  inFlight = true;
  try {
    const token = await registerForPushNotificationsAsync();
    if (!token) return;
    const alreadySynced = await SecureStore.getItemAsync(PushTokenSyncedStorageKey);
    if (alreadySynced === token) return;
    await registerPushToken({
      token,
      deviceId: await getOrCreateInstallationId(),
      platform: Platform.OS,
    });
    await SecureStore.setItemAsync(PushTokenSyncedStorageKey, token);
  } catch {
    // Best-effort: the next dashboard mount retries.
  } finally {
    inFlight = false;
  }
}

/**
 * Forgets that this install's token was registered, so the next signed-in
 * dashboard mount re-registers it under the (possibly different) user.
 */
export async function clearSyncedPushToken(): Promise<void> {
  if (Platform.OS === 'web') return;
  await SecureStore.deleteItemAsync(PushTokenSyncedStorageKey).catch(() => undefined);
}
