import { ActivityIndicator, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { DebtorExtractRequestScreen } from '@/components/debtor-registry/debtor-extract-request-screen';
import { homeRouteGuardStyles } from '@/components/home/home-route-guard.styles';
import { LoginPalette } from '@/constants/login';
import { useHomeRouteSessionGuard } from '@/hooks/use-session-navigation';

export default function DebtorsExtractRoute() {
  const { t } = useTranslation();
  const canShowPage = useHomeRouteSessionGuard();

  if (!canShowPage) {
    return (
      <View style={homeRouteGuardStyles.boot}>
        <ActivityIndicator
          size="large"
          color={LoginPalette.primary}
          accessibilityLabel={t('login.sessionBootLoadingA11yLabel')}
        />
      </View>
    );
  }

  return <DebtorExtractRequestScreen />;
}
