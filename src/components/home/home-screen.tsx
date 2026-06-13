import { lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, View } from "react-native";

import { SeoHead } from "@/components/seo-head";
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
  const { t } = useTranslation();
  const { displayName } = useSessionUserProfile();

  return (
    <View style={homeScreenStyles.page}>
      <SeoHead title={t("home.headerLogoGeo")} />
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
