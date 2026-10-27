/**
 * Spacing — strict 4/8 grid. Use these named tokens for padding, margin and
 * gap instead of raw pixels. `space(n)` is an escape hatch that returns n * 4.
 */

export const Spacing = {
  none: 0,
  hair: 2, // half-step, use sparingly (icon nudges, tight stacks)
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  giant: 48,
  mega: 64,
} as const;

export type SpacingToken = keyof typeof Spacing;

/** n steps on the 4pt grid → pixels. `space(5)` === 20. */
export const space = (steps: number): number => steps * 4;

/** Minimum accessible touch target (iOS HIG / WCAG 2.5.5). */
export const HitTarget = 44;

/** Standard hitSlop to lift a small control up to the 44pt target. */
export const hitSlop = (visibleSize: number) => {
  const pad = Math.max(0, Math.ceil((HitTarget - visibleSize) / 2));
  return { top: pad, bottom: pad, left: pad, right: pad };
};
