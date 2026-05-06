import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { I18nextProvider } from "react-i18next";
import { Dimensions, useColorScheme, View } from "react-native";

import "@/lib/api-client";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { AppToast } from "@/components/app-toast";
import { I18nLocaleBootstrap } from "@/components/i18n/i18n-locale-bootstrap";
import { QueryProvider } from "@/components/query-provider";
import i18n from "@/i18n/i18n";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const screenWidth = Dimensions.get('window').width;
  const maxTabletWidth = 920;
  const maxWidth = screenWidth > maxTabletWidth ? 590 : screenWidth;

  return (
    <I18nextProvider i18n={i18n}>
      <View style={{ flex: 1, paddingVertical: screenWidth > maxTabletWidth ? 80 : 0, 
      backgroundColor: "white", maxWidth: maxWidth, 
        marginLeft: screenWidth > maxTabletWidth ? (screenWidth - maxWidth) / 2 : 0 }}>
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
          <QueryProvider>
            <I18nLocaleBootstrap />
            <AnimatedSplashOverlay />
            <Stack screenOptions={{ headerShown: false }} />
            <AppToast />
          </QueryProvider>
        </ThemeProvider>
      </View>
    </I18nextProvider>
  );
}
