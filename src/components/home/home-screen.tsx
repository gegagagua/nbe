import { View } from "react-native";

import { AppSafeArea } from "@/components/ui/app-safe-area";
import { useSessionUserProfile } from "@/hooks/use-session-user-profile";

import { HomeDashboardLayout } from "./home-dashboard-layout";
import { HomeHeader } from "./home-header";
import { HomeNavGrid } from "./home-nav-grid";
import { homeScreenStyles } from "./home-screen.styles";

export function HomeScreen() {
  const { displayName } = useSessionUserProfile();

  return (
    <View style={homeScreenStyles.page}>
      <AppSafeArea style={homeScreenStyles.body}>
        <HomeHeader displayName={displayName} />
        <HomeDashboardLayout>
          <HomeNavGrid />
        </HomeDashboardLayout>
      </AppSafeArea>
    </View>
  );
}
