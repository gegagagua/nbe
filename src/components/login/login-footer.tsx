import Constants from 'expo-constants';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { Space } from '@/constants/theme';

import { loginFooterStyles } from './login-footer.styles';

const appVersion = Constants.expoConfig?.version ?? '';

export function LoginFooter() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, Space.small);

  return (
    <View style={[loginFooterStyles.bar, { paddingBottom: bottomPad }]}>
      <Text style={loginFooterStyles.left}>{t('login.footerLeft')}</Text>
      {appVersion ? (
        <Text style={loginFooterStyles.version}>{`v${appVersion}`}</Text>
      ) : null}
    </View>
  );
}
