import { useTranslation } from "react-i18next";
import { ActivityIndicator, View } from "react-native";

import { NotificationDetailScreen } from "@/components/notifications/notification-detail-screen";
import { LoginPalette } from "@/constants/login";
import { useHomeRouteSessionGuard } from "@/hooks/use-session-navigation";

export default function NotificationDetailRoute() {
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

  return <NotificationDetailScreen />;
}
