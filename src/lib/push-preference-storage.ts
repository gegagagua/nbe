import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { PushEnabledStorageKeyPrefix } from '@/constants/api';

function storageKey(userId: number | string): string {
  return `${PushEnabledStorageKeyPrefix}${userId}`;
}

/**
 * Last push on/off choice the given user made on this installation. Defaults to
 * `true`, since a freshly registered device receives pushes.
 */
export async function getPushEnabled(userId: number | string): Promise<boolean> {
  const key = storageKey(userId);
  const raw =
    Platform.OS === 'web'
      ? typeof localStorage === 'undefined'
        ? null
        : localStorage.getItem(key)
      : await SecureStore.getItemAsync(key);
  return raw !== 'false';
}

export async function setPushEnabled(
  userId: number | string,
  enabled: boolean,
): Promise<void> {
  const key = storageKey(userId);
  const value = String(enabled);
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}
