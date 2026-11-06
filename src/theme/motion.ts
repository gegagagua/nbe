/**
 * Motion tokens — keep micro-interactions consistent across the app.
 * Pair with Reanimated's withTiming/withSpring using these values.
 */

import { Easing } from 'react-native-reanimated';

export const Duration = {
  instant: 90,
  fast: 120,
  base: 200,
  slow: 320,
} as const;

export const AppEasing = {
  standard: Easing.out(Easing.cubic),
  decelerate: Easing.out(Easing.quad),
  accelerate: Easing.in(Easing.quad),
} as const;

/** Standard pressed-state feedback for AnimatedPressable. */
export const Press = {
  scale: 0.97,
  scaleStrong: 0.95,
  opacity: 0.9,
} as const;

/** Default spring for lively (Modern Civic) press/enter transitions. */
export const Spring = {
  damping: 18,
  stiffness: 220,
  mass: 0.6,
} as const;
