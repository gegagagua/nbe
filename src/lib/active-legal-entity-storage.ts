import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { ActiveLegalEntityStorageKey } from '@/constants/api';
import type { LegalEntity } from '@/types/users';

function isLegalEntity(value: unknown): value is LegalEntity {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const o = value as Record<string, unknown>;
  return typeof o.id === 'number' && typeof o.name === 'string';
}

export async function getActiveLegalEntity(): Promise<LegalEntity | null> {
  let raw: string | null = null;
  if (Platform.OS === 'web') {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    raw = localStorage.getItem(ActiveLegalEntityStorageKey);
  } else {
    raw = await SecureStore.getItemAsync(ActiveLegalEntityStorageKey);
  }
  if (!raw) {
    return null;
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    return isLegalEntity(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export async function setActiveLegalEntity(entity: LegalEntity): Promise<void> {
  const raw = JSON.stringify(entity);
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(ActiveLegalEntityStorageKey, raw);
    }
    return;
  }
  await SecureStore.setItemAsync(ActiveLegalEntityStorageKey, raw);
}

export async function clearActiveLegalEntity(): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(ActiveLegalEntityStorageKey);
    }
    return;
  }
  await SecureStore.deleteItemAsync(ActiveLegalEntityStorageKey);
}
