import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { AnimatedPressable } from '@/components/ui/animated-pressable';
import { HomeDashboardPalette } from '@/constants/home-dashboard';
import { Spacing } from '@/constants/theme';
import type { HomeNavCardProps } from '@/types/home-dashboard';

import { homeNavCardStyles, navTabBackground } from './home-nav-card.styles';

export function HomeNavCard({
  item,
  onPress,
  fullWidth,
  index = 0,
}: HomeNavCardProps & { fullWidth?: boolean; index?: number }) {
  const { t } = useTranslation();
  const title = t(item.titleKey);
  const tabColor = navTabBackground[item.accent];
  const disabled = item.disabled === true;

  return (
    <Animated.View
      entering={FadeInUp.duration(320).delay(index * 60).springify().damping(16)}
      style={[homeNavCardStyles.wrap, fullWidth && { width: '100%' }]}>
      <AnimatedPressable
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        pressedScale={0.96}
        android_ripple={
          disabled
            ? undefined
            : { color: 'rgba(43, 67, 108, 0.12)', foreground: true }
        }
        style={[
          homeNavCardStyles.card,
          fullWidth && { paddingBottom: Spacing.one },
          disabled && homeNavCardStyles.cardDisabled,
        ]}>
        <View style={homeNavCardStyles.tabAnchor} pointerEvents="none">
          <View
            style={[
              homeNavCardStyles.tab,
              { backgroundColor: tabColor },
              disabled && homeNavCardStyles.tabDisabled,
            ]}>
            <MaterialCommunityIcons
              name={
                item.icon as ComponentProps<
                  typeof MaterialCommunityIcons
                >['name']
              }
              size={32}
              color={HomeDashboardPalette.headerText}
            />
          </View>
        </View>
        <View style={homeNavCardStyles.cardBody}>
          <Text
            style={[
              homeNavCardStyles.title,
              disabled && homeNavCardStyles.titleDisabled,
            ]}
            numberOfLines={2}>
            {title}
          </Text>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
}
