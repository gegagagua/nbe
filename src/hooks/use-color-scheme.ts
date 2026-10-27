import { useColorScheme as useNativewindColorScheme } from 'nativewind';

/**
 * Resolved active color scheme ('light' | 'dark').
 *
 * Backed by NativeWind so a manual override set via the appearance toggle
 * (see ThemePreferenceProvider) is reflected everywhere — both the `dark:`
 * className variants and the design tokens read through `useAppTheme`. When the
 * preference is `system`, NativeWind follows the device scheme.
 */
export function useColorScheme(): 'light' | 'dark' {
  return useNativewindColorScheme().colorScheme ?? 'light';
}
