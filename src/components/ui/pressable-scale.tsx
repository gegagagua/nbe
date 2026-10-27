import { forwardRef } from 'react';
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  type View,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { haptics } from '@/lib/haptics';
import { Duration, AppEasing } from '@/theme/motion';

const AnimatedPressableBase = Animated.createAnimatedComponent(Pressable);

type HapticKind = 'tap' | 'select' | 'heavy' | 'none';

export type PressableScaleProps = Omit<PressableProps, 'style'> & {
  /** NativeWind classes. Use the `active:` variant for pressed-state colors. */
  className?: string;
  pressedScale?: number;
  /** Scale animation duration (ms). */
  durationMs?: number;
  /** Haptic fired on press. Defaults to 'tap'. Set 'none' to disable. */
  haptic?: HapticKind;
  /** Extra static style merged under the animated transform. */
  style?: StyleProp<ViewStyle>;
};

/**
 * Pressable with a UI-thread scale worklet (transform only — no layout, no JS
 * Animated). The press-state class swap + haptic keep feedback crisp at 60fps.
 */
export const PressableScale = forwardRef<View, PressableScaleProps>(function PressableScale(
  {
    className,
    pressedScale = 0.97,
    durationMs = Duration.fast,
    haptic = 'tap',
    disabled,
    style,
    onPress,
    onPressIn,
    onPressOut,
    ...rest
  },
  ref,
) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressableBase
      ref={ref}
      disabled={disabled}
      className={className}
      style={[style, animatedStyle]}
      onPressIn={(e) => {
        if (!disabled) {
          scale.value = withTiming(pressedScale, { duration: durationMs, easing: AppEasing.standard });
        }
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withTiming(1, { duration: durationMs, easing: AppEasing.standard });
        onPressOut?.(e);
      }}
      onPress={(e) => {
        if (disabled) return;
        if (haptic !== 'none') haptics[haptic]();
        onPress?.(e);
      }}
      {...rest}
    />
  );
});
