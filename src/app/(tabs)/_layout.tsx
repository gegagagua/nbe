import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useTranslation } from "react-i18next";

import { BottomTabBar, BOTTOM_TAB_SPACE } from "@/components/ui/bottom-tab-bar";
import { useAppTheme } from "@/theme";
import { useHomeRouteSessionGuard } from "@/hooks/use-session-navigation";

export default function AppTabsLayout() {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const canShowTabs = useHomeRouteSessionGuard();

  if (!canShowTabs) {
    return (
      <View className="flex-1 items-center justify-center bg-bg">
        <ActivityIndicator
          size="large"
          color={colors.primary}
          accessibilityLabel={t("login.sessionBootLoadingA11yLabel")}
        />
      </View>
    );
  }

  return (
    <Tabs
      initialRouteName="dashboard"
      tabBar={(props) => <BottomTabBar {...(props as unknown as BottomTabBarProps)} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { paddingBottom: BOTTOM_TAB_SPACE, backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: t("homeTabs.tabDashboard"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home-variant"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="faq"
        options={{
          title: t("homeTabs.tabFaq"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="help-circle-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: t("homeTabs.tabChat"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="chat-processing-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="contact"
        options={{
          title: t("homeTabs.tabContact"),
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="phone-outline"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
