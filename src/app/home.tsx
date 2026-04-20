import { ActivityIndicator, View } from "react-native";

import { HomeScreen } from "@/components/home/home-screen";
import { LoginPalette } from "@/constants/login";
import { LoginCopy } from "@/constants/login-copy";
import { useHomeRouteSessionGuard } from "@/hooks/use-session-navigation";

import { homeRouteStyles } from "./home-route.styles";

export default function HomeRoute() {
  const canShowHome = useHomeRouteSessionGuard();

  if (!canShowHome) {
    return (
      <View style={homeRouteStyles.boot}>
        <ActivityIndicator
          size="large"
          color={LoginPalette.primary}
          accessibilityLabel={LoginCopy.sessionBootLoadingA11yLabel}
        />
      </View>
    );
  }

  return <HomeScreen />;
}
