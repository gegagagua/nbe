import { ActivityIndicator, View } from 'react-native';

import { DebtorRegistryScreen } from '@/components/debtor-registry/debtor-registry-screen';
import { homeRouteGuardStyles } from '@/components/home/home-route-guard.styles';
import { LoginPalette } from '@/constants/login';
import { LoginCopy } from '@/constants/login-copy';
import { useHomeRouteSessionGuard } from '@/hooks/use-session-navigation';

export default function DebtorsRoute() {
  const canShowPage = useHomeRouteSessionGuard();

  if (!canShowPage) {
    return (
      <View style={homeRouteGuardStyles.boot}>
        <ActivityIndicator
          size="large"
          color={LoginPalette.primary}
          accessibilityLabel={LoginCopy.sessionBootLoadingA11yLabel}
        />
      </View>
    );
  }

  return <DebtorRegistryScreen />;
}
