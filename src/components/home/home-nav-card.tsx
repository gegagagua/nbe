import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const title = t(item.titleKey);
  const tabColor = navTabBackground[item.accent];
  const disabled = item.disabled === true;

  return (
    <View style={[homeNavCardStyles.wrap, fullWidth && { width: '100%' }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
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
              size={32}
              color={HomeDashboardPalette.headerText}
            />
          </View>
        </View>
        <View style={homeNavCardStyles.cardBody}>
          <Text style={homeNavCardStyles.title} numberOfLines={2}>
            {title}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
