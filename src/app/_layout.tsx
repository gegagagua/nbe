import "@/global.css";

import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider,
} from "expo-router";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { I18nextProvider } from "react-i18next";
import { Dimensions, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

import "@/lib/api-client";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { AppToast } from "@/components/app-toast";
import { I18nLocaleBootstrap } from "@/components/i18n/i18n-locale-bootstrap";
import { QueryProvider } from "@/components/query-provider";
import { ThemePreferenceProvider } from "@/components/theme/theme-preference-provider";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useNotificationNavigation } from "@/hooks/use-notification-navigation";
import i18n from "@/i18n/i18n";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  useNotificationNavigation();
  const screenWidth = Dimensions.get('window').width;
  const maxTabletWidth = 920;
  const maxWidth = screenWidth > maxTabletWidth ? 590 : screenWidth;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <I18nextProvider i18n={i18n}>
        <ThemePreferenceProvider>
        <KeyboardProvider>
          <View
            className="bg-bg"
            style={{ flex: 1, paddingVertical: screenWidth > maxTabletWidth ? 80 : 0,
            maxWidth: maxWidth,
              marginLeft: screenWidth > maxTabletWidth ? (screenWidth - maxWidth) / 2 : 0 }}>
            <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
              <QueryProvider>
                <BottomSheetModalProvider>
                  <I18nLocaleBootstrap />
                  <AnimatedSplashOverlay />
                  <Stack
                    screenOptions={{
                      headerShown: false,
                      animation: 'slide_from_right',
                      animationDuration: 240,
                      gestureEnabled: true,
                    }}
                  >
                    {/* Auth and the logged-in tabs are different navigation worlds:
                        disable the swipe-back gesture on both so you can't swipe
                        across the auth boundary in either direction. In-app screens
                        (cases, profile, …) keep their back-swipe from screenOptions. */}
                    <Stack.Screen name="index" options={{ gestureEnabled: false }} />
                    <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
                  </Stack>
                  <AppToast />
                </BottomSheetModalProvider>
              </QueryProvider>
            </ThemeProvider>
          </View>
        </KeyboardProvider>
        </ThemePreferenceProvider>
      </I18nextProvider>
    </GestureHandlerRootView>
  );
}
