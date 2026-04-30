import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import {
  HomeDashboardLayoutConst,
  HomeDashboardPalette,
} from '@/constants/home-dashboard';
import { HomeDashboardCopy } from '@/constants/home-dashboard-copy';
import { signOut } from '@/lib/sign-out';
import type { HomeHeaderProps } from '@/types/home-dashboard';

import { homeHeaderStyles } from './home-header.styles';

export function HomeHeader({ displayName }: HomeHeaderProps) {
  const profileA11yLabel = displayName.trim() || HomeDashboardCopy.userFallback;
  const profileA11y = `${profileA11yLabel}. ${HomeDashboardCopy.profileSignOutA11yHint}`;

  return (
    <View style={homeHeaderStyles.bar}>
      <View
        style={homeHeaderStyles.logoWrap}
        accessibilityRole="image"
        accessibilityLabel={HomeDashboardCopy.headerLogoA11yLabel}>
        <Text style={homeHeaderStyles.logoGeo} numberOfLines={2}>
          {HomeDashboardCopy.headerLogoGeo}
        </Text>
        <View style={homeHeaderStyles.logoDivider} />
        <Text style={homeHeaderStyles.logoEn} numberOfLines={2}>
          {HomeDashboardCopy.headerLogoEn}
        </Text>
      </View>
      <View style={homeHeaderStyles.actions}>
        <Pressable
          style={homeHeaderStyles.actionPress}
          accessibilityRole="button"
          accessibilityLabel={profileA11y}
          onPress={() => void signOut()}>
          <MaterialCommunityIcons
            name="account-circle-outline"
            size={HomeDashboardLayoutConst.headerProfileIconSize}
            color={HomeDashboardPalette.headerText}
          />
        </Pressable>
      </View>
    </View>
  );
}
