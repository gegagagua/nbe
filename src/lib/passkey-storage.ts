import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import {
  PasskeyCredentialIdStorageKey,
  PasskeyInstallationIdStorageKey,
} from '@/constants/api';

async function readRaw(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(key);
  }
  return SecureStore.getItemAsync(key);
}

async function writeRaw(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function deleteRaw(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

/**
 * A stable per-installation identifier. Generated once (app-owned UUID, never a
 * hardware id such as IMEI) and reused for every register call from this install.
 */
export async function getOrCreateInstallationId(): Promise<string> {
  const existing = await readRaw(PasskeyInstallationIdStorageKey);
  if (existing) return existing;
  const id = Crypto.randomUUID();
  await writeRaw(PasskeyInstallationIdStorageKey, id);
  return id;
}

export async function getPasskeyCredentialId(): Promise<string | null> {
  return readRaw(PasskeyCredentialIdStorageKey);
}

export async function setPasskeyCredentialId(credentialId: string): Promise<void> {
  await writeRaw(PasskeyCredentialIdStorageKey, credentialId);
}

export async function clearPasskeyCredentialId(): Promise<void> {
  await deleteRaw(PasskeyCredentialIdStorageKey);
}
