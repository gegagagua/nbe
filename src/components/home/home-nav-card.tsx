import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";

import {
    HomeDashboardLayoutConst,
    HomeDashboardPalette,
} from "@/constants/home-dashboard";
import type { HomeNavCardProps } from "@/types/home-dashboard";

import { homeNavCardStyles, navTabBackground } from "./home-nav-card.styles";

export function HomeNavCard({ item, onPress }: HomeNavCardProps) {
  const tabColor = navTabBackground[item.accent];

  return (
    <View style={homeNavCardStyles.wrap}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={item.title}
        onPress={onPress}
        android_ripple={{ color: "rgba(43, 67, 108, 0.12)", foreground: true }}
        style={({ pressed }) => [
          homeNavCardStyles.card,
          pressed && homeNavCardStyles.cardPressed,
        ]}
      >
        <View style={homeNavCardStyles.tabAnchor} pointerEvents="none">
          <View style={[homeNavCardStyles.tab, { backgroundColor: tabColor }]}>
            <MaterialCommunityIcons
              name={
                item.icon as ComponentProps<
                  typeof MaterialCommunityIcons
                >["name"]
              }
              size={HomeDashboardLayoutConst.navCardIconSize}
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
