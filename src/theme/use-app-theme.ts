/**
 * useAppTheme — the primary way components read the design system.
 *
 * Returns the resolved color tokens for the active scheme plus the static
 * scales (spacing, radii, type, motion) and scheme-aware shadows. Memoised so
 * StyleSheet factories can depend on it cheaply.
 *
 *   const t = useAppTheme();
 *   <View style={{ backgroundColor: t.colors.surface, padding: t.spacing.lg }} />
 */

import { useMemo } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';

import { type ColorScheme, type ColorTokens, schemeColors } from './colors';
import { Duration, AppEasing, Press, Spring } from './motion';
import { Radii } from './radii';
import { createShadows, type Shadows } from './shadows';
import { HitTarget, Spacing, hitSlop, space } from './spacing';
import { FontFamily, FontSize, FontWeight, TextVariants } from './typography';

export type AppTheme = {
  scheme: ColorScheme;
  isDark: boolean;
  colors: ColorTokens;
  spacing: typeof Spacing;
  space: typeof space;
  radii: typeof Radii;
  type: typeof TextVariants;
  fontFamily: typeof FontFamily;
  fontWeight: typeof FontWeight;
  fontSize: typeof FontSize;
  shadows: Shadows;
  motion: { duration: typeof Duration; easing: typeof AppEasing; press: typeof Press; spring: typeof Spring };
  hitTarget: number;
  hitSlop: typeof hitSlop;
};

export function useAppTheme(): AppTheme {
  const scheme = useColorScheme();
  const resolved: ColorScheme = scheme === 'dark' ? 'dark' : 'light';

  return useMemo(() => {
    const colors = schemeColors[resolved];
    return {
      scheme: resolved,
      isDark: resolved === 'dark',
      colors,
      spacing: Spacing,
      space,
      radii: Radii,
      type: TextVariants,
      fontFamily: FontFamily,
      fontWeight: FontWeight,
      fontSize: FontSize,
      shadows: createShadows(colors.shadow),
      motion: { duration: Duration, easing: AppEasing, press: Press, spring: Spring },
      hitTarget: HitTarget,
      hitSlop,
    };
  }, [resolved]);
}
