import { Text, View } from 'react-native';

import { LoginCopy } from '@/constants/login-copy';

import { loginBrandHeaderStyles } from './login-brand-header.styles';

export function LoginBrandHeader() {
  return (
    <View style={loginBrandHeaderStyles.row}>
      <View style={loginBrandHeaderStyles.markStack}>
        <View style={loginBrandHeaderStyles.markTop} />
        <View style={loginBrandHeaderStyles.markBottom} />
      </View>
      <View style={loginBrandHeaderStyles.textBlock}>
        <Text style={loginBrandHeaderStyles.geo}>{LoginCopy.brandGeo}</Text>
        <Text style={loginBrandHeaderStyles.en}>{LoginCopy.brandEn}</Text>
      </View>
    </View>
  );
}
