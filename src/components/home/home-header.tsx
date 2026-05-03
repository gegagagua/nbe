import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import {
  HomeDashboardLayoutConst,
  HomeDashboardPalette,
} from '@/constants/home-dashboard';
import { LoginInteraction } from '@/constants/login';
import { LocaleToggle } from '@/components/i18n/locale-toggle';
import { signOut } from '@/lib/sign-out';
import type { HomeHeaderProps } from '@/types/home-dashboard';

import { homeHeaderStyles } from './home-header.styles';

export function HomeHeader({ displayName }: HomeHeaderProps) {
  const { t } = useTranslation();
  const profileA11yLabel = displayName.trim() || t('home.userFallback');
  const profileA11y = `${profileA11yLabel}. ${t('home.profileSignOutA11yHint')}`;

  return (
    <View style={homeHeaderStyles.bar}>
      <Pressable
        style={({ pressed }) => [
          homeHeaderStyles.logoWrap,
          pressed ? { opacity: LoginInteraction.pressedOpacity } : null,
        ]}
        accessibilityRole="button"
        accessibilityLabel={t('home.headerLogoA11yLabel')}
        accessibilityHint={t('home.headerLogoGoHomeA11yHint')}
        onPress={() => router.navigate('/dashboard')}>
        <Text style={homeHeaderStyles.logoGeo} numberOfLines={2}>
          {t('home.headerLogoGeo')}
        </Text>
        <View style={homeHeaderStyles.logoDivider} />
        <Text style={homeHeaderStyles.logoEn} numberOfLines={2}>
          {t('home.headerLogoEn')}
        </Text>
      </Pressable>
      <View style={homeHeaderStyles.actions}>
        <LocaleToggle />
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
