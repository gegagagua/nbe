import Constants from 'expo-constants';
import { Platform, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { Space } from '@/constants/theme';

import { loginFooterStyles } from './login-footer.styles';

const appVersion = Constants.expoConfig?.version ?? '';

export function LoginFooter() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  // Without edge-to-edge, Android reports insets.bottom === 0, so the footer
  // text ends up sitting right on top of the system navigation bar. Give it a
  // larger floor on Android so it always has breathing room above the nav bar.
  const minBottomPad = Platform.OS === 'android' ? Space.large : Space.small;
  const bottomPad = Math.max(insets.bottom, minBottomPad);

  return (
    <View style={[loginFooterStyles.bar, { paddingBottom: bottomPad }]}>
      <Text style={loginFooterStyles.left}>{t('login.footerLeft')}</Text>
      {appVersion ? (
        <Text style={loginFooterStyles.version}>{`v${appVersion}`}</Text>
      ) : null}
    </View>
  );
}
