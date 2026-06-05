import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { LocaleToggle } from '@/components/i18n/locale-toggle';
import { UnreadCountBadge } from '@/components/ui/unread-count-badge';
import {
  CASE_SCREEN_HEADER_MOCK,
  USE_CASE_LIST_LAYOUT_MOCK,
} from '@/constants/case-list-layout-mock';
import {
  HomeDashboardLayoutConst,
  HomeDashboardPalette,
} from '@/constants/home-dashboard';
import { LoginInteraction } from '@/constants/login';
import { useUnreadNotificationsCount } from '@/hooks/use-unread-notifications-count';
import { isGuestMode } from '@/lib/guest-mode';
import type { HomeHeaderProps } from '@/types/home-dashboard';

import { homeHeaderStyles } from './home-header.styles';

export function HomeHeader({ displayName }: HomeHeaderProps) {
  const { t } = useTranslation();
  const isGuest = isGuestMode();
  const profileA11yLabel = displayName.trim() || t('home.userFallback');
  const api = useUnreadNotificationsCount({ enabled: !USE_CASE_LIST_LAYOUT_MOCK });
  const count = USE_CASE_LIST_LAYOUT_MOCK ? CASE_SCREEN_HEADER_MOCK.unreadCount : api.count;
  const isLoading = USE_CASE_LIST_LAYOUT_MOCK ? CASE_SCREEN_HEADER_MOCK.unreadLoading : api.isLoading;
  const handleProfilePress = () => {
    if (isGuest) {
      router.push('/');
      return;
    }
    router.push('/profile');
  };

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
        <View style={homeHeaderStyles.profileWrap}>
          <Pressable
            style={homeHeaderStyles.actionPress}
            accessibilityRole="button"
            accessibilityLabel={profileA11yLabel}
            onPress={handleProfilePress}>
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={HomeDashboardLayoutConst.headerProfileIconSize}
              color={HomeDashboardPalette.headerText}
            />
          </Pressable>
          {!isGuest && count > 0 && (
            <View style={homeHeaderStyles.badgeWrap}>
              <UnreadCountBadge count={count} loading={isLoading} small />
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
