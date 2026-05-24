import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { hashPassword } from '@/lib/password-hash';

const STORAGE_KEY = 'nbe_password_history';
const MAX_HISTORY = 3;

export type PasswordHistoryEntry = {
  hash: string;
  changedAt: string; // ISO date string
};

async function readHistory(): Promise<PasswordHistoryEntry[]> {
  try {
    let raw: string | null = null;
    if (Platform.OS === 'web') {
      raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    } else {
      raw = await SecureStore.getItemAsync(STORAGE_KEY);
    }
    if (!raw) return [];
    return JSON.parse(raw) as PasswordHistoryEntry[];
  } catch {
    return [];
  }
}

async function writeHistory(entries: PasswordHistoryEntry[]): Promise<void> {
  const raw = JSON.stringify(entries);
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, raw);
    }
  } else {
    await SecureStore.setItemAsync(STORAGE_KEY, raw);
  }
}

export async function getPasswordHistory(): Promise<PasswordHistoryEntry[]> {
  return readHistory();
}

export async function isSimilarPasswordUsed(newPassword: string): Promise<boolean> {
  const history = await readHistory();
  const newHash = await hashPassword(newPassword);
  return history.some((entry) => entry.hash === newHash);
}

export async function recordPasswordChange(newPassword: string): Promise<void> {
  const history = await readHistory();
  const newHash = await hashPassword(newPassword);
  const entry: PasswordHistoryEntry = {
    hash: newHash,
    changedAt: new Date().toISOString(),
  };
  const updated = [entry, ...history].slice(0, MAX_HISTORY);
  await writeHistory(updated);
}

export async function clearPasswordHistory(): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  } else {
    await SecureStore.deleteItemAsync(STORAGE_KEY);
  }
}
