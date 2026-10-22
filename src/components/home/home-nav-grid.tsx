import { router } from "expo-router";
import { View } from "react-native";

import { homeNavItems } from "@/constants/home-nav-items";
import { useActiveLegalEntity } from "@/hooks/use-active-legal-entity";
import { isGuestMode } from "@/lib/guest-mode";
import type { HomeNavItem } from "@/types/home-dashboard";

import { HomeNavCard } from "./home-nav-card";
import { homeNavGridStyles } from "./home-nav-grid.styles";

const homeRouteByNavItemId: Record<
  string,
  "/cases" | "/debtors" | "/facts" | undefined
> = {
  cases: "/cases",
  debtors: "/debtors",
  facts: "/facts",
};

export function HomeNavGrid() {
  const isGuest = isGuestMode();
  const isLegalEntity = useActiveLegalEntity().entity !== null;
  const visibleItems = homeNavItems
    .filter((item) => !(isGuest && item.hiddenForGuest))
    .map((item) =>
      isLegalEntity && item.disabledForLegalEntity
        ? { ...item, disabled: true }
        : item,
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
