import { ActivityIndicator, View } from 'react-native';

import { CaseScreen } from '@/components/cases/case-screen';
import { homeRouteGuardStyles } from '@/components/home/home-route-guard.styles';
import { USE_CASE_LIST_LAYOUT_MOCK } from '@/constants/case-list-layout-mock';
import { LoginPalette } from '@/constants/login';
import { LoginCopy } from '@/constants/login-copy';
import { useHomeRouteSessionGuard } from '@/hooks/use-session-navigation';

export default function CasesRoute() {
  const canShowPage = useHomeRouteSessionGuard({
    skip: USE_CASE_LIST_LAYOUT_MOCK,
  });

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

  return <CaseScreen />;
}
