/**
 * Design system — "Modern Civic".
 *
 * Primary entry point: `import { useAppTheme } from '@/theme';`
 * Static tokens are also exported for StyleSheet factories and non-component
 * code. Prefer the hook inside components so dark mode resolves automatically.
 */

export { useAppTheme, type AppTheme } from './use-app-theme';
export {
  schemeColors,
  lightColors,
  darkColors,
  type ColorScheme,
  type ColorTokens,
} from './colors';
export { Palette } from './palette';
export { Spacing, space, HitTarget, hitSlop, type SpacingToken } from './spacing';
export { Radii, type RadiusToken } from './radii';
export {
  TextVariants,
  FontSize,
  FontWeight,
  FontFamily,
  type TextVariant,
} from './typography';
export { createShadows, type Shadows, type ShadowToken } from './shadows';
export { Duration, AppEasing, Press, Spring } from './motion';
