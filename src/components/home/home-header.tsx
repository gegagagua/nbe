import Logo from "@/assets/images/logo.png";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LocaleToggle } from "@/components/i18n/locale-toggle";
import { PressableScale } from "@/components/ui/pressable-scale";
import { UnreadCountBadge } from "@/components/ui/unread-count-badge";
import { useUnreadNotificationsCount } from "@/hooks/use-unread-notifications-count";
import { isGuestMode } from "@/lib/guest-mode";
import { signOut } from "@/lib/sign-out";
import { hitSlop, useAppTheme } from "@/theme";
import type { HomeHeaderProps } from "@/types/home-dashboard";

export function HomeHeader({ displayName }: HomeHeaderProps) {
  const { t } = useTranslation();
  const t2 = useAppTheme();
  const insets = useSafeAreaInsets();
  const isGuest = isGuestMode();
  const name = displayName.trim() || t("home.userFallback");
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
    <View
      className="rounded-b-[28px] bg-primary px-4 pb-5"
      style={[t2.shadows.md, { paddingTop: insets.top + 6 }]}>
      <View className="flex-row items-center justify-between">
        <PressableScale
          haptic="none"
          pressedScale={0.94}
          accessibilityRole="button"
          accessibilityLabel={t("home.headerLogoA11yLabel")}
          accessibilityHint={t("home.headerLogoGoHomeA11yHint")}
          onPress={() => router.navigate("/dashboard")}
          className="h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
          <Image
            source={Logo}
            style={{ width: 30, height: 30 }}
            contentFit="contain"
            cachePolicy="memory-disk"
            priority="high"
            transition={0}
            accessibilityLabel={t("home.headerLogoA11yLabel")}
          />
        </PressableScale>

        <View className="flex-row items-center gap-1.5">
          <LocaleToggle />

          {!isGuest && (
            <View className="relative">
              <PressableScale
                accessibilityRole="button"
                accessibilityLabel={t("home.notificationsA11yLabel")}
                hitSlop={hitSlop(44)}
                pressedScale={0.88}
                onPress={() => router.push("/notifications")}
                className="h-11 w-11 items-center justify-center rounded-full bg-white/15">
                <MaterialCommunityIcons
                  name={count > 0 ? "bell-badge-outline" : "bell-outline"}
                  size={22}
                  color={t2.colors.onPrimary}
                />
              </PressableScale>
              {count > 0 && (
                <View className="absolute -right-1 -top-1">
                  <UnreadCountBadge count={count} loading={isLoading} small />
                </View>
              )}
            </View>
          )}

          <PressableScale
            accessibilityRole="button"
            accessibilityLabel={name}
            hitSlop={hitSlop(44)}
            pressedScale={0.88}
            onPress={handleProfilePress}
            className="h-11 w-11 items-center justify-center rounded-full bg-white/15">
            <MaterialCommunityIcons name="account" size={22} color={t2.colors.onPrimary} />
          </PressableScale>
        </View>
      </View>

      <View className="mt-4">
        <Text numberOfLines={1} className="text-caption text-on-primary/70">
          {t("home.headerLogoGeo")}
        </Text>
        <Text numberOfLines={1} className="text-title font-bold text-on-primary">
          {name}
        </Text>
      </View>
    </View>
  );
}
