import { router } from "expo-router";
import { View } from "react-native";

import { homeNavItems } from "@/constants/home-nav-items";
import { isGuestMode } from "@/lib/guest-mode";
import type { HomeNavItem } from "@/types/home-dashboard";

import { HomeNavCard } from "./home-nav-card";
import { homeNavGridStyles } from "./home-nav-grid.styles";

const homeRouteByNavItemId: Record<string, "/cases" | "/debtors" | undefined> =
  {
    cases: "/cases",
    debtors: "/debtors",
  };

export function HomeNavGrid() {
  const isGuest = isGuestMode();
  const visibleItems = homeNavItems.filter(
    (item) => !(isGuest && item.hiddenForGuest),
  );

  const onCardPress = (item: HomeNavItem) => {
    if (item.disabled) {
      return;
    }
    const route = homeRouteByNavItemId[item.id];
    if (route) {
      router.push(route);
    }
  };

  return (
    <View style={homeNavGridStyles.row}>
      {visibleItems.map((item, index) => (
        <HomeNavCard
          key={item.id}
          item={item}
          index={index}
          fullWidth={!isGuest && index === visibleItems.length - 1}
          onPress={() => onCardPress(item)}
        />
      ))}
    </View>
  );
}
