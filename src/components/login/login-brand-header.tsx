import Logo from '@/assets/images/logo.png';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Image } from 'expo-image';

import { loginBrandHeaderStyles } from './login-brand-header.styles';

export function LoginBrandHeader() {
  const { t } = useTranslation();

  return (
    <View style={loginBrandHeaderStyles.container}>
      <Image source={Logo} style={{ width: 50, height: 50 }} />
      <View>
        <Text style={loginBrandHeaderStyles.brandEn} numberOfLines={3}>
          {t('login.brandGeo')}
        </Text>
        <View style={loginBrandHeaderStyles.brandDivider} />
        <Text style={loginBrandHeaderStyles.brandGeo} numberOfLines={2}>
          {t('login.brandEn')}
        </Text>
      </View>
    </View>
  );
}
