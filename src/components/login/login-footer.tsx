import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LoginCopy } from '@/constants/login-copy';
import { Spacing } from '@/constants/theme';

import { loginFooterStyles } from './login-footer.styles';

export function LoginFooter() {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, Spacing.two);

  return (
    <View style={[loginFooterStyles.bar, { paddingBottom: bottomPad }]}>
      <Text style={loginFooterStyles.left}>{LoginCopy.footerLeft}</Text>
      <View style={loginFooterStyles.right}>
        <View style={loginFooterStyles.agencyMark} accessibilityLabel={LoginCopy.agencyName} />
        <Text style={loginFooterStyles.agencyText}>{LoginCopy.agencyName}</Text>
      </View>
    </View>
  );
}
