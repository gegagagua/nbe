import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import type { ComponentProps } from 'react';

import { Button } from '@/components/ui/button';
import { useAppTheme } from '@/theme';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type EmptyStateProps = {
  icon?: IconName;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function EmptyState({
  icon = 'inbox-outline',
  title,
  message,
  actionLabel,
  onAction,
  compact,
  style,
}: EmptyStateProps) {
  const { colors } = useAppTheme();

  return (
    <Animated.View
      entering={FadeIn.duration(220)}
      className={`items-center justify-center px-5 ${compact ? 'py-5' : 'py-12'}`}
      style={style}>
      <View className="mb-1 h-[72px] w-[72px] items-center justify-center rounded-full bg-primary-subtle">
        <MaterialCommunityIcons name={icon} size={34} color={colors.primary} />
      </View>
      <Text className="mt-2 text-center text-subtitle font-semibold text-fg">{title}</Text>
      {message ? (
        <Text className="mt-1 max-w-[320px] text-center text-body text-fg-muted">{message}</Text>
      ) : null}
      {actionLabel && onAction ? (
        <View className="mt-3">
          <Button label={actionLabel} onPress={onAction} variant="secondary" size="sm" fullWidth={false} />
        </View>
      ) : null}
    </Animated.View>
  );
}
