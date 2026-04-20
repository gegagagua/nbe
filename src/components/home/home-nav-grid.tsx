import { View } from "react-native";
import { router } from "expo-router";

import { homeNavItems } from "@/constants/home-nav-items";
import type { HomeNavItem } from "@/types/home-dashboard";

import { HomeNavCard } from "./home-nav-card";
import { homeNavGridStyles } from "./home-nav-grid.styles";

export function HomeNavGrid() {
  const onCardPress = (item: HomeNavItem) => {
    if (item.id === "cases") {
      router.push("/cases");
      return;
    }
    if (item.id === "debtors") {
      router.push("/debtors");
    }
  };

  return (
    <View style={homeNavGridStyles.row}>
      {homeNavItems.map((item) => (
        <HomeNavCard key={item.id} item={item} onPress={() => onCardPress(item)} />
      ))}
    </View>
  );
}
