import { useColorScheme as useNativewindColorScheme } from 'nativewind';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import { persistThemePreference, readStoredThemePreference } from '@/lib/theme-storage';
import type { ThemePreference } from '@/types/theme-preference';

type ThemePreferenceContextValue = {
  /** The user's stored choice: 'system' (default), 'light' or 'dark'. */
  preference: ThemePreference;
  /** Persist a new choice and apply it immediately. */
  setPreference: (pref: ThemePreference) => void;
};

const ThemePreferenceContext = createContext<ThemePreferenceContextValue | null>(null);

/**
 * Owns the appearance preference. NativeWind drives the actual scheme (and
 * doesn't persist across launches), so on boot we read the stored choice and
 * re-apply it. `setColorScheme('system')` reverts to following the device.
 */
export function ThemePreferenceProvider({ children }: { children: ReactNode }) {
  const { setColorScheme } = useNativewindColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('system');

  useEffect(() => {
    readStoredThemePreference().then((stored) => {
      if (!stored || stored === 'system') return;
      setPreferenceState(stored);
      setColorScheme(stored);
    });
  }, [setColorScheme]);

  function setPreference(pref: ThemePreference) {
    setPreferenceState(pref);
    setColorScheme(pref);
    persistThemePreference(pref);
  }

  return (
    <ThemePreferenceContext.Provider value={{ preference, setPreference }}>
      {children}
    </ThemePreferenceContext.Provider>
  );
}

export function useThemePreference(): ThemePreferenceContextValue {
  const ctx = useContext(ThemePreferenceContext);
  if (!ctx) {
    throw new Error('useThemePreference must be used within a ThemePreferenceProvider');
  }
  return ctx;
}
