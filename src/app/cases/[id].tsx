import { ActivityIndicator, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { CaseDetailScreen } from '@/components/cases/case-detail-screen';
import { homeRouteGuardStyles } from '@/components/home/home-route-guard.styles';
import { USE_CASE_LIST_LAYOUT_MOCK } from '@/constants/case-list-layout-mock';
import { LoginPalette } from '@/constants/login';
import { useHomeRouteSessionGuard } from '@/hooks/use-session-navigation';

export default function CaseDetailRoute() {
  const { t } = useTranslation();
  const canShowPage = useHomeRouteSessionGuard({
    skip: USE_CASE_LIST_LAYOUT_MOCK,
  });

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

  return <CaseDetailScreen />;
}
