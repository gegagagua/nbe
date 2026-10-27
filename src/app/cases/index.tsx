import { useTranslation } from "react-i18next";
import { ActivityIndicator, View } from "react-native";

import { CaseScreen } from "@/components/cases/case-screen";
import { LoginPalette } from "@/constants/login";
import { useHomeRouteSessionGuard } from "@/hooks/use-session-navigation";

export default function CasesRoute() {
  const { t } = useTranslation();
  const canShowPage = useHomeRouteSessionGuard();

  if (!canShowPage) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator
          size="large"
          color={LoginPalette.primary}
          accessibilityLabel={t("login.sessionBootLoadingA11yLabel")}
        />
      </View>
    );
  }

  return <CaseScreen />;
}
