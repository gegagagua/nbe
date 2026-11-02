import * as SecureStore from 'expo-secure-store';

import type { ThemePreference } from '@/types/theme-preference';

export const THEME_PREFERENCE_STORAGE_KEY = 'app_theme_preference';

export async function readStoredThemePreference(): Promise<ThemePreference | null> {
  try {
    const v = await SecureStore.getItemAsync(THEME_PREFERENCE_STORAGE_KEY);
    if (v === 'system' || v === 'light' || v === 'dark') return v;
  } catch {
    return null;
  }
  return null;
}

export async function persistThemePreference(pref: ThemePreference): Promise<void> {
  await SecureStore.setItemAsync(THEME_PREFERENCE_STORAGE_KEY, pref);
}
