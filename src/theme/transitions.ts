/**
 * Motion presets — reanimated layout animations for lists and screen content.
 * All are transform/opacity based (no width/height/margin animation) and tuned
 * to the 150–300ms Civic Glass window so they never block interaction.
 *
 * Usage:
 *   <Animated.View entering={listEntering(index)} exiting={ListExiting} layout={ItemLayout} />
 */

import {
  FadeIn,
  FadeInDown,
  FadeOut,
  LinearTransition,
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated';

import { Duration } from './motion';

/** Staggered fade+rise for list items, capped so long lists don't lag the tail. */
export const listEntering = (index: number) =>
  FadeInDown.duration(Duration.base).delay(Math.min(index, 8) * 28);

export const ListExiting = FadeOut.duration(Duration.fast);

/** Smooth reflow when items are inserted/removed/reordered. */
export const ItemLayout = LinearTransition.duration(Duration.base);

/** Screen-content enter/exit (for in-page view swaps, not native-stack). */
export const ScreenEntering = SlideInRight.duration(Duration.base);
export const ScreenExiting = SlideOutLeft.duration(Duration.fast);

/** Simple content fade-in for hero/empty blocks. */
export const ContentFadeIn = FadeIn.duration(Duration.base);
