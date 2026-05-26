import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import {
  FaceIdCredentialsStorageKey,
  FaceIdEnabledStorageKey,
} from '@/constants/api';
import type { FaceIdCredentials } from '@/types/face-id';

async function readRaw(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
}

async function writeRaw(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
    }
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function deleteRaw(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
    }
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

export async function getFaceIdEnabled(): Promise<boolean> {
  const raw = await readRaw(FaceIdEnabledStorageKey);
  return raw === '1';
}

export async function setFaceIdEnabled(enabled: boolean): Promise<void> {
  if (enabled) {
    await writeRaw(FaceIdEnabledStorageKey, '1');
  } else {
    await deleteRaw(FaceIdEnabledStorageKey);
  }
}

export async function getFaceIdCredentials(): Promise<FaceIdCredentials | null> {
  const raw = await readRaw(FaceIdCredentialsStorageKey);
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      typeof (parsed as Record<string, unknown>).username === 'string' &&
      typeof (parsed as Record<string, unknown>).password === 'string'
    ) {
      return parsed as FaceIdCredentials;
    }
    return null;
  } catch {
    return null;
  }
}

export async function setFaceIdCredentials(creds: FaceIdCredentials): Promise<void> {
  await writeRaw(FaceIdCredentialsStorageKey, JSON.stringify(creds));
}

export async function clearFaceIdCredentials(): Promise<void> {
  await deleteRaw(FaceIdCredentialsStorageKey);
}

export async function clearFaceIdAll(): Promise<void> {
  await Promise.all([
    deleteRaw(FaceIdEnabledStorageKey),
    deleteRaw(FaceIdCredentialsStorageKey),
  ]);
}
