import * as SecureStore from 'expo-secure-store';

import type { AppLocale } from '@/types/app-locale';

export const LOCALE_STORAGE_KEY = 'app_locale';

export async function readStoredLocale(): Promise<AppLocale | null> {
  try {
    const v = await SecureStore.getItemAsync(LOCALE_STORAGE_KEY);
    if (v === 'ka' || v === 'en') return v;
  } catch {
    return null;
  }
  return null;
}

export async function persistLocale(locale: AppLocale): Promise<void> {
  await SecureStore.setItemAsync(LOCALE_STORAGE_KEY, locale);
}
