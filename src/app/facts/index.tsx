import { useTranslation } from "react-i18next";
import { ActivityIndicator, View } from "react-native";

import { FactsScreen } from "@/components/facts/facts-screen";
import { homeRouteGuardStyles } from "@/components/home/home-route-guard.styles";
import { LoginPalette } from "@/constants/login";
import { useHomeRouteSessionGuard } from "@/hooks/use-session-navigation";

export default function FactsRoute() {
  const { t } = useTranslation();
  const canShowPage = useHomeRouteSessionGuard();

  if (!canShowPage) {
    return (
      <View style={homeRouteGuardStyles.boot}>
        <ActivityIndicator
          size="large"
          color={LoginPalette.primary}
          accessibilityLabel={t("login.sessionBootLoadingA11yLabel")}
        />
      </View>
    );
  }

  return <FactsScreen />;
}
