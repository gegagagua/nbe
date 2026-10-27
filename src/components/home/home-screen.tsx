import { StatusBar } from "expo-status-bar";
import { lazy, Suspense } from "react";
import { ActivityIndicator, View } from "react-native";

import { useSessionUserProfile } from "@/hooks/use-session-user-profile";
import { useAppTheme } from "@/theme";

import { HomeDashboardLayout } from "./home-dashboard-layout";
import { HomeHeader } from "./home-header";
import { TestPushButton } from "./test-push-button";

// Code-split the nav grid into its own web chunk so the header (hero) paints
// first and the grid streams in right after.
const HomeNavGrid = lazy(() =>
  import("./home-nav-grid").then((m) => ({ default: m.HomeNavGrid })),
);

export function HomeScreen() {
  const { displayName } = useSessionUserProfile();
  const { colors } = useAppTheme();

  return (
    <View className="flex-1 bg-bg">
      {/* Navy hero header sits under the status bar — keep its icons light. */}
      <StatusBar style="light" />
      <HomeHeader displayName={displayName} />
      <HomeDashboardLayout>
        <Suspense
          fallback={
            <View className="items-center justify-center py-6">
              <ActivityIndicator color={colors.primary} />
            </View>
          }
        >
          <HomeNavGrid />
        </Suspense>
        <TestPushButton />
      </HomeDashboardLayout>
    </View>
  );
}
