import { useColorScheme as useNativewindColorScheme } from 'nativewind';

/**
 * Web variant. NativeWind's hook is already hydration-safe, so it also carries
 * any manual override set through the appearance toggle.
 */
export function useColorScheme(): 'light' | 'dark' {
  return useNativewindColorScheme().colorScheme ?? 'light';
}
