import { useEffect } from 'react';
import type { DimensionValue, StyleProp, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export type SkeletonProps = {
  width?: DimensionValue;
  height?: number;
  radius?: number;
  className?: string;
  style?: StyleProp<ViewStyle>;
};

/** A single shimmering placeholder block (opacity pulse — UI-thread, no layout). */
export function Skeleton({ width = '100%', height = 16, radius = 8, className, style }: SkeletonProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0.5, 1]),
  }));

  return (
    <Animated.View
      className={`bg-skeleton ${className ?? ''}`}
      style={[{ width, height, borderRadius: radius }, animatedStyle, style]}
    />
  );
}

/** Convenience multi-line text skeleton. */
export function SkeletonText({
  lines = 3,
  lastLineWidth = '60%',
}: {
  lines?: number;
  lastLineWidth?: DimensionValue;
}) {
  return (
    <Animated.View className="gap-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} height={12} width={i === lines - 1 ? lastLineWidth : '100%'} />
      ))}
    </Animated.View>
  );
}
