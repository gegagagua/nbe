import {
  colorScheme as nativewindColorScheme,
  useColorScheme as useNativewindColorScheme,
} from 'nativewind';
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
  /** The user's stored choice: 'light' (default), 'dark' or 'system'. */
  preference: ThemePreference;
  /** Persist a new choice and apply it immediately. */
  setPreference: (pref: ThemePreference) => void;
};

const ThemePreferenceContext = createContext<ThemePreferenceContextValue | null>(null);

// Apply the light default before the first render so a device in night mode
// doesn't flash dark while the stored preference is still being read.
nativewindColorScheme.set('light');

/**
 * Owns the appearance preference. NativeWind drives the actual scheme (and
 * doesn't persist across launches), so on boot we read the stored choice and
 * re-apply it. `setColorScheme('system')` reverts to following the device.
 */
export function ThemePreferenceProvider({ children }: { children: ReactNode }) {
  const { setColorScheme } = useNativewindColorScheme();
  const [preference, setPreferenceState] = useState<ThemePreference>('light');

  useEffect(() => {
    readStoredThemePreference().then((stored) => {
      // No stored choice defaults to LIGHT, not 'system': following the device
      // scheme made fresh installs come up dark on phones in night mode and
      // light elsewhere, so iOS and Android looked different out of the box.
      // Dark / system stay available as explicit choices in the profile.
      const initial = stored ?? 'light';
      setPreferenceState(initial);
      setColorScheme(initial);
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
