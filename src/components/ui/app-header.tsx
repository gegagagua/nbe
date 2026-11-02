import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ComponentProps } from 'react';

import { GlassSurface } from '@/components/ui/glass-surface';
import { PressableScale } from '@/components/ui/pressable-scale';
import { useAppTheme, hitSlop } from '@/theme';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type AppHeaderAction = {
  icon: IconName;
  onPress: () => void;
  accessibilityLabel: string;
  badge?: number;
  tint?: string;
};

export type AppHeaderProps = {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightActions?: AppHeaderAction[];
  /** Render a large collapsing title block below the bar. */
  largeTitle?: boolean;
  /** Scroll offset driving the collapse (from useAnimatedScrollHandler). */
  scrollY?: SharedValue<number>;
  /** Hairline + glass intensify once scrolled. Defaults true. */
  border?: boolean;
};

/** Distance over which the large title collapses into the compact bar. */
export const HEADER_COLLAPSE_DISTANCE = 48;
const TAP = 40;

export function AppHeader({
  title,
  subtitle,
  showBack = true,
  onBack,
  rightActions = [],
  largeTitle = false,
  scrollY,
  border = true,
}: AppHeaderProps) {
  const { colors } = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBack = () => (onBack ? onBack() : router.back());

  // Compact (in-bar) title fades in as the large title collapses.
  const compactTitleStyle = useAnimatedStyle(() => {
    if (!largeTitle) return { opacity: 1 };
    const sv = scrollY?.value ?? 0;
    return {
      opacity: interpolate(sv, [HEADER_COLLAPSE_DISTANCE * 0.4, HEADER_COLLAPSE_DISTANCE], [0, 1], 'clamp'),
    };
  });

  const largeTitleStyle = useAnimatedStyle(() => {
    const sv = scrollY?.value ?? 0;
    return {
      opacity: interpolate(sv, [0, HEADER_COLLAPSE_DISTANCE], [1, 0], 'clamp'),
      transform: [{ translateY: interpolate(sv, [0, HEADER_COLLAPSE_DISTANCE], [0, -8], 'clamp') }],
    };
  });

  return (
    <GlassSurface
      className={`${border ? 'border-b border-border' : ''}`}
      style={{ paddingTop: insets.top }}>
      <View className="min-h-[52px] flex-row items-center gap-2 px-3">
        {showBack ? (
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel="Back"
            hitSlop={hitSlop(TAP)}
            pressedScale={0.88}
            onPress={handleBack}
            className="h-10 w-10 items-center justify-center rounded-sm">
            <MaterialCommunityIcons name="chevron-left" size={28} color={colors.text} />
          </PressableScale>
        ) : (
          <View className="w-1" />
        )}

        <View className="flex-1">
          <Animated.Text
            numberOfLines={1}
            className="text-heading font-bold text-fg"
            style={compactTitleStyle}>
            {title}
          </Animated.Text>
          {subtitle && !largeTitle ? (
            <Text numberOfLines={1} className="text-caption text-fg-muted">
              {subtitle}
            </Text>
          ) : null}
        </View>

        {rightActions.map((action, i) => (
          <PressableScale
            key={`${action.icon}-${i}`}
            accessibilityRole="button"
            accessibilityLabel={action.accessibilityLabel}
            hitSlop={hitSlop(TAP)}
            pressedScale={0.88}
            onPress={action.onPress}
            className="h-10 w-10 items-center justify-center rounded-sm">
            <MaterialCommunityIcons name={action.icon} size={24} color={action.tint ?? colors.text} />
            {action.badge && action.badge > 0 ? (
              <View className="absolute right-1 top-1 h-4 min-w-[16px] items-center justify-center rounded-full bg-danger px-[3px]">
                <Text className="text-[10px] font-bold text-on-danger">
                  {action.badge > 99 ? '99+' : action.badge}
                </Text>
              </View>
            ) : null}
          </PressableScale>
        ))}
      </View>

      {largeTitle ? (
        <Animated.View className="px-4 pb-3 pt-1" style={largeTitleStyle}>
          <Text numberOfLines={2} className="text-hero font-bold text-fg">
            {title}
          </Text>
          {subtitle ? <Text className="mt-0.5 text-body text-fg-muted">{subtitle}</Text> : null}
        </Animated.View>
      ) : null}
    </GlassSurface>
  );
}
