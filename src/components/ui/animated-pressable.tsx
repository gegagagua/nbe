import { forwardRef } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle, type View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const AnimatedPressableBase = Animated.createAnimatedComponent(Pressable);

type Props = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  pressedScale?: number;
  pressedOpacity?: number;
  durationMs?: number;
};

export const AnimatedPressable = forwardRef<View, Props>(function AnimatedPressable(
  {
    style,
    pressedScale = 0.97,
    pressedOpacity = 0.85,
    durationMs = 120,
    onPressIn,
    onPressOut,
    disabled,
    ...rest
  },
  ref,
) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const easing = Easing.out(Easing.quad);

  return (
    <AnimatedPressableBase
      ref={ref}
      disabled={disabled}
      onPressIn={(e) => {
        if (!disabled) {
          scale.value = withTiming(pressedScale, { duration: durationMs, easing });
          opacity.value = withTiming(pressedOpacity, { duration: durationMs, easing });
        }
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withTiming(1, { duration: durationMs, easing });
        opacity.value = withTiming(1, { duration: durationMs, easing });
        onPressOut?.(e);
      }}
      style={[style, animatedStyle]}
      {...rest}
    />
  );
});
