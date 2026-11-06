/**
 * Typography — the Modern Civic type scale.
 *
 * Each variant is a ready-to-spread style snippet (fontSize + lineHeight +
 * weight + tracking). Use `useAppTheme().type.title` etc., or import
 * `TextVariants` directly where color is applied separately.
 */

import { Platform, type TextStyle } from 'react-native';

export const FontFamily = Platform.select({
  ios: { regular: 'System', medium: 'System', bold: 'System' },
  android: { regular: 'sans-serif', medium: 'sans-serif-medium', bold: 'sans-serif' },
  default: { regular: 'System', medium: 'System', bold: 'System' },
})!;

export const FontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

/** Raw size ramp, for the rare case a variant doesn't fit. */
export const FontSize = {
  caption: 11,
  label: 13,
  body: 15,
  subtitle: 16,
  heading: 18,
  title: 22,
  display: 30,
} as const;

type Variant = Pick<TextStyle, 'fontSize' | 'lineHeight' | 'fontWeight' | 'letterSpacing'>;

export const TextVariants = {
  display: { fontSize: 30, lineHeight: 36, fontWeight: '700', letterSpacing: -0.4 },
  title: { fontSize: 22, lineHeight: 28, fontWeight: '700', letterSpacing: -0.2 },
  heading: { fontSize: 18, lineHeight: 24, fontWeight: '700', letterSpacing: -0.1 },
  subtitle: { fontSize: 16, lineHeight: 22, fontWeight: '600' },
  bodyLg: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
  body: { fontSize: 15, lineHeight: 23, fontWeight: '400' },
  bodyMedium: { fontSize: 15, lineHeight: 22, fontWeight: '500' },
  bodyStrong: { fontSize: 15, lineHeight: 22, fontWeight: '600' },
  label: { fontSize: 13, lineHeight: 18, fontWeight: '600', letterSpacing: 0.1 },
  caption: { fontSize: 11, lineHeight: 15, fontWeight: '500', letterSpacing: 0.2 },
  button: { fontSize: 15, lineHeight: 20, fontWeight: '600', letterSpacing: 0.1 },
  overline: { fontSize: 11, lineHeight: 14, fontWeight: '700', letterSpacing: 0.8 },
} satisfies Record<string, Variant>;

export type TextVariant = keyof typeof TextVariants;
