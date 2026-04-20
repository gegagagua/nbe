import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { SessionStorageKey } from '@/constants/api';

export async function getSessionToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    return localStorage.getItem(SessionStorageKey);
  }
  return SecureStore.getItemAsync(SessionStorageKey);
}

export async function setSessionToken(token: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(SessionStorageKey, token);
    }
    return;
  }
  await SecureStore.setItemAsync(SessionStorageKey, token);
}

export async function clearSessionToken(): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(SessionStorageKey);
    }
    return;
  }
  await SecureStore.deleteItemAsync(SessionStorageKey);
}
