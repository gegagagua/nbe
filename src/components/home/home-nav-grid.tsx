import { router } from "expo-router";
import { View } from "react-native";

import { homeNavItems } from "@/constants/home-nav-items";
import type { HomeNavItem } from "@/types/home-dashboard";

import { HomeNavCard } from "./home-nav-card";
import { homeNavGridStyles } from "./home-nav-grid.styles";

const homeRouteByNavItemId: Record<string, "/cases" | "/debtors" | undefined> =
  {
    cases: "/cases",
    debtors: "/debtors",
  };

export function HomeNavGrid() {
  const onCardPress = (item: HomeNavItem) => {
    const route = homeRouteByNavItemId[item.id];
    if (route) {
      router.push(route);
    }
  };

  return (
    <View style={homeNavGridStyles.row}>
      {homeNavItems.map((item, index) => (
        <HomeNavCard
          key={item.id}
          item={item}
          fullWidth={index === homeNavItems.length - 1}
          onPress={() => onCardPress(item)}
        />
      ))}
    </View>
  );
}
