/**
 * Corner radii. Modern Civic leans on 12/16/20 for cards and controls.
 */

export const Radii = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  pill: 999,
} as const;

export type RadiusToken = keyof typeof Radii;
