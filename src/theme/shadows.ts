/**
 * Elevation — cross-platform. iOS reads shadow*, Android reads elevation.
 * Shadows are a function of the active scheme's shadow color so dark mode
 * stays subtle (it leans on borders + elevation rather than big soft shadows).
 *
 * Use `useAppTheme().shadows.md` — the hook bakes in the right shadow color.
 */

import type { ViewStyle } from 'react-native';

export type ShadowToken = 'none' | 'sm' | 'md' | 'lg' | 'xl';
export type Shadows = Record<ShadowToken, ViewStyle>;

export function createShadows(shadowColor: string): Shadows {
  return {
    none: {
      shadowColor: 'transparent',
      shadowOpacity: 0,
      shadowRadius: 0,
      shadowOffset: { width: 0, height: 0 },
      elevation: 0,
    },
    sm: {
      shadowColor,
      shadowOpacity: 0.06,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 1 },
      elevation: 2,
    },
    md: {
      shadowColor,
      shadowOpacity: 0.1,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
      elevation: 5,
    },
    lg: {
      shadowColor,
      shadowOpacity: 0.14,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 8 },
      elevation: 10,
    },
    xl: {
      shadowColor,
      shadowOpacity: 0.2,
      shadowRadius: 32,
      shadowOffset: { width: 0, height: 16 },
      elevation: 18,
    },
  };
}
