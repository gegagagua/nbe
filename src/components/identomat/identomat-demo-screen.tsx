import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { WebView } from 'react-native-webview';

import { AppSafeArea } from '@/components/ui/app-safe-area';
import { IDENTOMAT_DEMO_URL } from '@/constants/identomat';
import { Layout } from '@/constants/layout';
import { LoginPalette } from '@/constants/login';

import { identomatDemoScreenStyles } from './identomat-demo-screen.styles';

type IdentomatDemoScreenProps = { onBack: () => void };

type IdentomatDemoScreenRouteProps = IdentomatDemoScreenProps & {
  sourceUrl?: string;
};

export function IdentomatDemoScreen({ onBack, sourceUrl }: IdentomatDemoScreenRouteProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  return (
    <View style={identomatDemoScreenStyles.page}>
      <AppSafeArea style={identomatDemoScreenStyles.safe} edges={['top']}>
        <View style={identomatDemoScreenStyles.navRow}>
          <Pressable
            style={identomatDemoScreenStyles.hit}
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel={t('login.identomatDemoBackA11yLabel')}>
            <MaterialCommunityIcons
              name="chevron-left"
              size={Layout.registerBackIconSize}
              color={LoginPalette.primary}
            />
            <Text style={identomatDemoScreenStyles.backLabel}>
              {t('login.identomatDemoPageTitle')}
            </Text>
          </Pressable>
        </View>
        <View style={identomatDemoScreenStyles.webviewWrap}>
          <WebView
            source={{ uri: sourceUrl ?? IDENTOMAT_DEMO_URL }}
            style={identomatDemoScreenStyles.webview}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            javaScriptEnabled
            domStorageEnabled
          />
          {loading ? (
            <View style={identomatDemoScreenStyles.loadingOverlay}>
              <ActivityIndicator size="large" color={LoginPalette.primary} />
            </View>
          ) : null}
        </View>
      </AppSafeArea>
    </View>
  );
}
