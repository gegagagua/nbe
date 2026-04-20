import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

import '@/lib/api-client';

import { AppToast } from '@/components/app-toast';
import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { QueryProvider } from '@/components/query-provider';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <QueryProvider>
        <AnimatedSplashOverlay />
        <Stack screenOptions={{ headerShown: false }} />
        <AppToast />
      </QueryProvider>
    </ThemeProvider>
  );
}
