import { View, type StyleProp, type ViewStyle } from 'react-native';

import { PressableScale } from '@/components/ui/pressable-scale';
import { useAppTheme, type ShadowToken } from '@/theme';

type CardPadding = 'none' | 'sm' | 'md' | 'lg';

const PAD: Record<CardPadding, string> = {
  none: '',
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-5',
};

export type CardProps = {
  children: React.ReactNode;
  /** Inner padding preset. Defaults to `md` (16). */
  padding?: CardPadding;
  /** Elevation preset. Defaults to `sm`. Use `none` for flat/bordered cards. */
  elevation?: ShadowToken;
  /** Makes the card pressable with scale feedback. */
  onPress?: () => void;
  disabled?: boolean;
  haptic?: boolean;
  /** Extra NativeWind classes. */
  className?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
};

export function Card({
  children,
  padding = 'md',
  elevation = 'sm',
  onPress,
  disabled,
  haptic = true,
  className,
  style,
  testID,
  accessibilityLabel,
}: CardProps) {
  const t = useAppTheme();
  const box = `rounded-xl border border-border bg-surface ${PAD[padding]} ${className ?? ''}`;
  const shadow = t.shadows[elevation];

  if (onPress) {
    return (
      <PressableScale
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled }}
        disabled={disabled}
        pressedScale={t.motion.press.scale}
        haptic={haptic ? 'tap' : 'none'}
        onPress={onPress}
        className={`${box} ${disabled ? 'opacity-55' : ''}`}
        style={[shadow, style]}>
        {children}
      </PressableScale>
    );
  }

  return (
    <View testID={testID} className={box} style={[shadow, style]}>
      {children}
    </View>
  );
}
