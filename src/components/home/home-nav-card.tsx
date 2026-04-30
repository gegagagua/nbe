import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, Text, View } from 'react-native';

import { HomeDashboardPalette } from '@/constants/home-dashboard';
import { Spacing } from '@/constants/theme';
import type { HomeNavCardProps } from '@/types/home-dashboard';

import { homeNavCardStyles, navTabBackground } from './home-nav-card.styles';

export function HomeNavCard({
  item,
  onPress,
  fullWidth,
}: HomeNavCardProps & { fullWidth?: boolean }) {
  const tabColor = navTabBackground[item.accent];
  const disabled = item.disabled === true;

  return (
    <View style={[homeNavCardStyles.wrap, fullWidth && { width: '100%' }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={item.title}
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        android_ripple={
          disabled
            ? undefined
            : { color: 'rgba(43, 67, 108, 0.12)', foreground: true }
        }
        style={({ pressed }) => [
          homeNavCardStyles.card,
          fullWidth && { paddingBottom: Spacing.one },
          disabled && homeNavCardStyles.cardDisabled,
          pressed && !disabled && homeNavCardStyles.cardPressed,
        ]}>
        <View style={homeNavCardStyles.tabAnchor} pointerEvents="none">
          <View style={[homeNavCardStyles.tab, { backgroundColor: tabColor }]}>
            <MaterialCommunityIcons
              name={
                item.icon as ComponentProps<
                  typeof MaterialCommunityIcons
                >['name']
              }
              size={24}
              color={HomeDashboardPalette.headerText}
            />
          </View>
        </View>
        <Text style={homeNavCardStyles.title} numberOfLines={2}>
          {item.title}
        </Text>
      </Pressable>
    </View>
  );
}
