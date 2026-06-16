import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { SessionUserProfileStorageKey } from '@/constants/api';
import type { SessionUserProfileBrief } from '@/types/session';

function isProfile(value: unknown): value is SessionUserProfileBrief {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const o = value as Record<string, unknown>;
  if (typeof o.firstName !== 'string' || typeof o.lastName !== 'string') {
    return false;
  }
  // Migrate older stored profiles that pre-date username/id fields
  if (typeof o.username !== 'string') o.username = '';
  if (typeof o.id !== 'number') o.id = 0;
  // lastSession / pwdChngDate are optional, kept as-is when present.
  return true;
}

export async function getSessionUserProfile(): Promise<SessionUserProfileBrief | null> {
  let raw: string | null = null;
  if (Platform.OS === 'web') {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    raw = localStorage.getItem(SessionUserProfileStorageKey);
  } else {
    raw = await SecureStore.getItemAsync(SessionUserProfileStorageKey);
  }
  if (!raw) {
    return null;
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    return isProfile(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export async function setSessionUserProfile(profile: SessionUserProfileBrief): Promise<void> {
  const raw = JSON.stringify(profile);
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(SessionUserProfileStorageKey, raw);
    }
    return;
  }
  await SecureStore.setItemAsync(SessionUserProfileStorageKey, raw);
}

export async function clearSessionUserProfile(): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(SessionUserProfileStorageKey);
    }
    return;
  }
  await SecureStore.deleteItemAsync(SessionUserProfileStorageKey);
}
