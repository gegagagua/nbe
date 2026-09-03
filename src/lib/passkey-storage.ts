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

// ── Software authenticator key material (Expo Go / no native module) ───────────
// The pure-JS WebAuthn fallback (see passkey-software-authenticator.ts) has no
// Secure Enclave to hold the private key, so it persists the P-256 key here,
// keyed by the WebAuthn credential id it minted. Real dev/prod builds never use
// this path — the OS keeps the key and these entries stay empty.

export type SoftwarePasskeyRecord = {
  /** P-256 private scalar, hex-encoded. */
  privHex: string;
  /** WebAuthn user handle (Base64URL) captured at registration, echoed on login. */
  userHandle: string | null;
  /** Signature counter; starts at 0 on register and increments per assertion. */
  counter: number;
};

function softwarePasskeyKey(credentialId: string): string {
  return `nbe_passkey_sw_${credentialId}`;
}

export async function getSoftwarePasskey(
  credentialId: string,
): Promise<SoftwarePasskeyRecord | null> {
  const raw = await readRaw(softwarePasskeyKey(credentialId));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SoftwarePasskeyRecord;
  } catch {
    return null;
  }
}

export async function setSoftwarePasskey(
  credentialId: string,
  record: SoftwarePasskeyRecord,
): Promise<void> {
  await writeRaw(softwarePasskeyKey(credentialId), JSON.stringify(record));
}

export async function clearSoftwarePasskey(credentialId: string): Promise<void> {
  await deleteRaw(softwarePasskeyKey(credentialId));
}
