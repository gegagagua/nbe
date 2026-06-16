import { lazy, Suspense } from "react";
import { ActivityIndicator, View } from "react-native";

import { AppSafeArea } from "@/components/ui/app-safe-area";
import { LoginPalette } from "@/constants/login";
import { useSessionUserProfile } from "@/hooks/use-session-user-profile";

import { HomeDashboardLayout } from "./home-dashboard-layout";
import { HomeHeader } from "./home-header";
import { homeScreenStyles } from "./home-screen.styles";

// Code-split the nav grid into its own web chunk so the header (hero) paints
// first and the grid streams in right after.
const HomeNavGrid = lazy(() =>
  import("./home-nav-grid").then((m) => ({ default: m.HomeNavGrid })),
);

export function HomeScreen() {
  const { displayName } = useSessionUserProfile();

  return (
    <View style={homeScreenStyles.page}>
      <AppSafeArea style={homeScreenStyles.body}>
        <HomeHeader displayName={displayName} />
        <HomeDashboardLayout>
          <Suspense
            fallback={
              <View style={homeScreenStyles.navFallback}>
                <ActivityIndicator color={LoginPalette.primary} />
              </View>
            }
          >
            <HomeNavGrid />
          </Suspense>
        </HomeDashboardLayout>
      </AppSafeArea>
    </View>
  );
}
