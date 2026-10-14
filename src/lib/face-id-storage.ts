import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import {
  FaceIdCredentialsStorageKey,
  FaceIdEnabledStorageKey,
} from '@/constants/api';
import type { FaceIdCredentials } from '@/types/face-id';

// Security (PEN073 F-3/F-4): the stored credentials must be bound to a fresh
// device authentication and to this device only. `requireAuthentication` makes
// the OS gate every read of the keychain/keystore item behind a biometric /
// device-credential prompt enforced in hardware — so an OTA-RCE payload or a
// Frida hook can no longer read the plaintext password by calling
// getItemAsync; the gate is no longer a bypassable JS check.
// `WHEN_UNLOCKED_THIS_DEVICE_ONLY` keeps the item off encrypted/iCloud backups.
const CREDENTIALS_SECURE_OPTIONS: SecureStore.SecureStoreOptions = {
  requireAuthentication: true,
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

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

/**
 * Read the biometric-gated credentials. On native this triggers the OS
 * authentication prompt (hardware-enforced) and THROWS if the user cancels,
 * fails, or the key was invalidated by a biometric enrolment change — callers
 * classify that error rather than silently getting null. A JSON that can't be
 * parsed still returns null. `authenticationPrompt` is the prompt subtitle.
 */
export async function getFaceIdCredentials(
  authenticationPrompt?: string,
): Promise<FaceIdCredentials | null> {
  let raw: string | null;
  if (Platform.OS === 'web') {
    raw = typeof localStorage === 'undefined'
      ? null
      : localStorage.getItem(FaceIdCredentialsStorageKey);
  } else {
    // Let auth/keystore errors propagate; only JSON parsing is tolerated below.
    raw = await SecureStore.getItemAsync(FaceIdCredentialsStorageKey, {
      ...CREDENTIALS_SECURE_OPTIONS,
      ...(authenticationPrompt ? { authenticationPrompt } : {}),
    });
  }
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

/**
 * Persist the biometric-gated credentials. On Android the write requires a
 * device authentication (the OS prompts); on iOS the item is stored with the
 * access-control gate and the prompt appears on read instead. `authenticationPrompt`
 * is surfaced if the platform prompts at write time.
 */
export async function setFaceIdCredentials(
  creds: FaceIdCredentials,
  authenticationPrompt?: string,
): Promise<void> {
  const value = JSON.stringify(creds);
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(FaceIdCredentialsStorageKey, value);
    }
    return;
  }
  await SecureStore.setItemAsync(FaceIdCredentialsStorageKey, value, {
    ...CREDENTIALS_SECURE_OPTIONS,
    ...(authenticationPrompt ? { authenticationPrompt } : {}),
  });
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
