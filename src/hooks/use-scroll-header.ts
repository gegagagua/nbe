import { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

/**
 * Drives a collapsing <AppHeader scrollY={…} />. Attach `scrollHandler` to an
 * Animated.ScrollView / Animated.FlatList / Animated FlashList `onScroll`, and
 * pass `scrollY` to the header. Runs entirely on the UI thread.
 *
 *   const { scrollY, scrollHandler } = useScrollHeader();
 *   <AppHeader title="Cases" largeTitle scrollY={scrollY} />
 *   <Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16} />
 */
export function useScrollHeader() {
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });
  return { scrollY, scrollHandler };
}
