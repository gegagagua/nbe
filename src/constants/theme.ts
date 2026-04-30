/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

/** Default app text scale — use these for `fontSize` instead of raw numbers. */
export const FontSize = {
  xss: 10,
  xs: 11,
  sm: 12,
  md: 14,
  lg: 15,
  xl: 16,
  xxl: 20,
} as const;

export type FontSizeKey = keyof typeof FontSize;

export const Typography = {
  extraSmall: FontSize.xss,
  small: FontSize.sm,
  medium: FontSize.md,
  large: FontSize.xl,
  extraLarge: FontSize.xxl,
} as const;

export const Space = {
  extraSmall: Spacing.one,
  small: Spacing.two,
  medium: Spacing.three,
  large: Spacing.four,
  extraLarge: Spacing.five,
} as const;

export const Radius = {
  extraSmall: 4,
  small: 8,
  medium: 12,
  large: 16,
  extraLarge: 20,
} as const;

export const LineHeight = {
  tight: 16,
  normal: 18,
  comfortable: 20,
} as const;

/**
 * Larger template headings (`ThemedText` marketing blocks) — outside the compact UI scale.
 */
export const TemplateHeadingFontSize = {
  subtitle: 32,
  title: 48,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
