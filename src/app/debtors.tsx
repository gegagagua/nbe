import { ActivityIndicator, View } from 'react-native';

import { DebtorRegistryScreen } from '@/components/debtor-registry/debtor-registry-screen';
import { LoginPalette } from '@/constants/login';
import { LoginCopy } from '@/constants/login-copy';
import { useHomeRouteSessionGuard } from '@/hooks/use-session-navigation';

import { homeRouteStyles } from './home-route.styles';

export default function DebtorsRoute() {
  const canShowPage = useHomeRouteSessionGuard();

  if (!canShowPage) {
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

  return <DebtorRegistryScreen />;
}
