import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { HomeTabsPalette } from "@/constants/home-tabs";
import { LoginPalette } from "@/constants/login";
import { LoginCopy } from "@/constants/login-copy";
import { useHomeRouteSessionGuard } from "@/hooks/use-session-navigation";

import { homeRouteStyles } from "../home-route.styles";
import { tabsLayoutStyles } from "./tabs-layout.styles";

export default function AppTabsLayout() {
  const canShowTabs = useHomeRouteSessionGuard();

  if (!canShowTabs) {
    return (
      <View style={homeRouteStyles.boot}>
        <ActivityIndicator
          size="large"
          color={LoginPalette.primary}
          accessibilityLabel={LoginCopy.sessionBootLoadingA11yLabel}
        />
      </View>
    );
  }

  return (
    <Tabs
      initialRouteName="dashboard"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: HomeTabsPalette.activeText,
        tabBarInactiveTintColor: HomeTabsPalette.onBarInactive,
        tabBarActiveBackgroundColor: HomeTabsPalette.onBarHighlight,
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
        tabBarIconStyle: { marginTop: 0 },
        tabBarItemStyle: [
          tabsLayoutStyles.tabItem,
          { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 4 },
        ],
        tabBarStyle: tabsLayoutStyles.tabBar,
        sceneStyle: { paddingBottom: 82 },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Home",
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
          title: "FAQ",
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
          title: "Chat",
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
          title: "Contact",
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
