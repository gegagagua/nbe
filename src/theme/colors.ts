/**
 * Semantic color tokens — the single source of truth for color across the app.
 *
 * `light` and `dark` share the SAME keys, so any component that reads a token
 * through `useAppTheme().colors` gets correct dark-mode behaviour for free.
 * Never hardcode hex in components; add a token here and consume it.
 */

import { Palette } from './palette';

export type ColorTokens = {
  // Brand
  primary: string;
  primaryPressed: string;
  primarySubtle: string;
  onPrimary: string;

  accent: string;
  accentPressed: string;
  accentSubtle: string;
  onAccent: string;

  // Semantic
  danger: string;
  dangerPressed: string;
  dangerSubtle: string;
  onDanger: string;

  success: string;
  successSubtle: string;
  onSuccess: string;

  warning: string;
  warningSubtle: string;
  onWarning: string;

  // Surfaces
  background: string;
  surface: string;
  surfaceElevated: string;
  surfaceSunken: string;
  surfacePressed: string;

  // Text
  text: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  textDisabled: string;

  // Lines
  border: string;
  borderStrong: string;
  borderFocus: string;

  // Inputs
  inputBg: string;
  inputBorder: string;
  inputBorderFocus: string;
  inputPlaceholder: string;
  inputText: string;

  // Chrome
  tabBarBg: string;
  tabBarActive: string;
  tabBarInactive: string;
  tabBarActiveBg: string;

  // Feedback / misc
  overlay: string;
  shadow: string;
  skeleton: string;
  skeletonHighlight: string;
  focusRing: string;
};

export const lightColors: ColorTokens = {
  primary: Palette.navy[500],
  primaryPressed: Palette.navy[600],
  primarySubtle: Palette.navy[50],
  onPrimary: Palette.white,

  accent: Palette.blue[500],
  accentPressed: Palette.blue[600],
  accentSubtle: Palette.blue[50],
  onAccent: Palette.white,

  danger: Palette.red.light,
  dangerPressed: Palette.red.pressed,
  dangerSubtle: Palette.red.subtleLight,
  onDanger: Palette.white,

  success: Palette.green.light,
  successSubtle: Palette.green.subtleLight,
  onSuccess: Palette.white,

  warning: Palette.amber.light,
  warningSubtle: Palette.amber.subtleLight,
  onWarning: Palette.white,

  background: Palette.slate[25],
  surface: Palette.slate[0],
  surfaceElevated: Palette.slate[0],
  surfaceSunken: Palette.slate[50],
  surfacePressed: Palette.slate[100],

  text: '#15223B',
  textSecondary: Palette.slate[500],
  textMuted: Palette.slate[400],
  textInverse: Palette.white,
  textDisabled: Palette.slate[300],

  border: Palette.slate[100],
  borderStrong: Palette.slate[200],
  borderFocus: Palette.blue[500],

  inputBg: Palette.slate[0],
  inputBorder: Palette.slate[200],
  inputBorderFocus: Palette.blue[500],
  inputPlaceholder: '#9AA4B4',
  inputText: '#15223B',

  // Brand-navy tab bar (white content on navy).
  tabBarBg: Palette.navy[500],
  tabBarActive: Palette.white,
  tabBarInactive: 'rgba(255, 255, 255, 0.6)',
  tabBarActiveBg: 'rgba(255, 255, 255, 0.16)',

  overlay: 'rgba(15, 23, 42, 0.45)',
  shadow: '#0F172A',
  skeleton: Palette.slate[100],
  skeletonHighlight: '#F2F6FB',
  focusRing: 'rgba(59, 130, 246, 0.35)',
};

export const darkColors: ColorTokens = {
  primary: Palette.blue[300],
  primaryPressed: Palette.blue[400],
  primarySubtle: Palette.navy[800],
  onPrimary: '#0B1220',

  accent: Palette.blue[500],
  accentPressed: Palette.blue[400],
  accentSubtle: '#15263E',
  onAccent: Palette.white,

  danger: Palette.red.dark,
  dangerPressed: Palette.red.darkPressed,
  dangerSubtle: Palette.red.subtleDark,
  onDanger: '#0B1220',

  success: Palette.green.dark,
  successSubtle: Palette.green.subtleDark,
  onSuccess: '#0B1220',

  warning: Palette.amber.dark,
  warningSubtle: Palette.amber.subtleDark,
  onWarning: '#0B1220',

  background: Palette.ink.bg,
  surface: Palette.ink.surface,
  surfaceElevated: Palette.ink.elevated,
  surfaceSunken: Palette.ink.sunken,
  surfacePressed: Palette.ink.pressed,

  text: Palette.ink.text,
  textSecondary: Palette.ink.textSecondary,
  textMuted: Palette.ink.textMuted,
  textInverse: '#0B1220',
  textDisabled: Palette.ink.textDisabled,

  border: Palette.ink.border,
  borderStrong: Palette.ink.borderStrong,
  borderFocus: Palette.blue[300],

  inputBg: Palette.ink.sunken,
  inputBorder: Palette.ink.inputBorder,
  inputBorderFocus: Palette.blue[300],
  inputPlaceholder: '#6B7585',
  inputText: Palette.ink.text,

  // Brand-navy tab bar (deeper navy in dark, white content).
  tabBarBg: Palette.navy[700],
  tabBarActive: Palette.white,
  tabBarInactive: 'rgba(255, 255, 255, 0.55)',
  tabBarActiveBg: 'rgba(255, 255, 255, 0.14)',

  overlay: 'rgba(0, 0, 0, 0.6)',
  shadow: Palette.black,
  skeleton: Palette.ink.elevated,
  skeletonHighlight: Palette.ink.border,
  focusRing: 'rgba(110, 168, 255, 0.35)',
};

export const schemeColors = {
  light: lightColors,
  dark: darkColors,
} as const;

export type ColorScheme = keyof typeof schemeColors;
