import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

import { LocaleToggle } from "@/components/i18n/locale-toggle";
import { UnreadCountBadge } from "@/components/ui/unread-count-badge";
import {
  HomeDashboardLayoutConst,
  HomeDashboardPalette,
} from "@/constants/home-dashboard";
import { LoginInteraction } from "@/constants/login";
import { useUnreadNotificationsCount } from "@/hooks/use-unread-notifications-count";
import { isGuestMode } from "@/lib/guest-mode";
import type { HomeHeaderProps } from "@/types/home-dashboard";

import { signOut } from "@/lib/sign-out";
import { homeHeaderStyles } from "./home-header.styles";

export function HomeHeader({ displayName }: HomeHeaderProps) {
  const { t } = useTranslation();
  const isGuest = isGuestMode();
  const profileA11yLabel = displayName.trim() || t("home.userFallback");
  const { count, isLoading } = useUnreadNotificationsCount();
  const handleProfilePress = () => {
    if (isGuest) {
      signOut();
      router.push("/");
      return;
    }
    router.push("/profile");
  };

  return (
    <View style={homeHeaderStyles.bar}>
      <Pressable
        style={({ pressed }) => [
          homeHeaderStyles.logoWrap,
          pressed ? { opacity: LoginInteraction.pressedOpacity } : null,
        ]}
        accessibilityRole="button"
        accessibilityLabel={t("home.headerLogoA11yLabel")}
        accessibilityHint={t("home.headerLogoGoHomeA11yHint")}
        onPress={() => router.navigate("/dashboard")}
      >
        <Text style={homeHeaderStyles.logoGeo} numberOfLines={2}>
          {t("home.headerLogoGeo")}
        </Text>
        <View style={homeHeaderStyles.logoDivider} />
        <Text style={homeHeaderStyles.logoEn} numberOfLines={2}>
          {t("home.headerLogoEn")}
        </Text>
      </Pressable>
      <View style={homeHeaderStyles.actions}>
        <LocaleToggle />
        {!isGuest && (
          <View style={homeHeaderStyles.profileWrap}>
            <Pressable
              style={homeHeaderStyles.actionPress}
              accessibilityRole="button"
              accessibilityLabel={t("home.notificationsA11yLabel")}
            >
              <MaterialCommunityIcons
                name={count > 0 ? "bell-badge-outline" : "bell-outline"}
                size={HomeDashboardLayoutConst.headerProfileIconSize}
                color={HomeDashboardPalette.headerText}
              />
            </Pressable>
            {count > 0 && (
              <View style={homeHeaderStyles.badgeWrap}>
                <UnreadCountBadge count={count} loading={isLoading} small />
              </View>
            )}
          </View>
        )}
        <Pressable
          style={homeHeaderStyles.actionPress}
          accessibilityRole="button"
          accessibilityLabel={profileA11yLabel}
          onPress={handleProfilePress}
        >
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
