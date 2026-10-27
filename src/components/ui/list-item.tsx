import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import type { ComponentProps } from 'react';

import { PressableScale } from '@/components/ui/pressable-scale';
import { useAppTheme } from '@/theme';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type ListItemProps = {
  title: string;
  subtitle?: string;
  leftIcon?: IconName;
  value?: string;
  showChevron?: boolean;
  right?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  /** Unread/active emphasis (accent dot + bolder title). */
  emphasized?: boolean;
  haptic?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function ListItem({
  title,
  subtitle,
  leftIcon,
  value,
  showChevron,
  right,
  onPress,
  disabled,
  emphasized,
  haptic = false,
  className,
  style,
  testID,
}: ListItemProps) {
  const { colors } = useAppTheme();
  const chevron = showChevron ?? !!onPress;

  const body = (
    <>
      {emphasized ? <View className="h-2 w-2 rounded-full bg-accent" /> : null}
      {leftIcon ? (
        <View className="h-10 w-10 items-center justify-center rounded-md bg-primary-subtle">
          <MaterialCommunityIcons name={leftIcon} size={20} color={colors.primary} />
        </View>
      ) : null}
      <View className="flex-1 gap-0.5">
        <Text
          numberOfLines={1}
          className={`text-body text-fg ${emphasized ? 'font-semibold' : 'font-medium'}`}>
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={2} className="text-caption text-fg-muted">
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right ?? (value ? <Text className="text-body font-medium text-fg-secondary">{value}</Text> : null)}
      {chevron ? (
        <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textMuted} />
      ) : null}
    </>
  );

  const box = `flex-row items-center gap-3 min-h-[56px] py-3 px-4 ${className ?? ''}`;

  if (onPress) {
    return (
      <PressableScale
        testID={testID}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        disabled={disabled}
        pressedScale={0.99}
        haptic={haptic ? 'select' : 'none'}
        onPress={onPress}
        className={`${box} active:bg-surface-pressed ${disabled ? 'opacity-50' : ''}`}
        style={style}>
        {body}
      </PressableScale>
    );
  }

  return (
    <View testID={testID} className={box} style={style}>
      {body}
    </View>
  );
}
