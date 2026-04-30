import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { I18nextProvider } from "react-i18next";

import "@/lib/api-client";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { AppToast } from "@/components/app-toast";
import { I18nLocaleBootstrap } from "@/components/i18n/i18n-locale-bootstrap";
import { QueryProvider } from "@/components/query-provider";
import i18n from "@/i18n/i18n";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <QueryProvider>
          <I18nLocaleBootstrap />
          <AnimatedSplashOverlay />
          <Stack screenOptions={{ headerShown: false }} />
          <AppToast />
        </QueryProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
}
