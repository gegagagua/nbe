import { Text, View } from 'react-native';

import { LoginCopy } from '@/constants/login-copy';
import type { LoginScreenLayoutProps } from '@/types/login';
import { AppSafeArea } from '@/components/ui/app-safe-area';

import { LoginFooter } from './login-footer';
import { loginScreenLayoutStyles } from './login-screen-layout.styles';

export function LoginScreenLayout({ children }: LoginScreenLayoutProps) {
  return (
    <View style={loginScreenLayoutStyles.page}>
      <AppSafeArea style={loginScreenLayoutStyles.body}>
        <Text style={loginScreenLayoutStyles.title}>{LoginCopy.pageTitle}</Text>
        <View style={loginScreenLayoutStyles.center}>{children}</View>
      </AppSafeArea>
      <LoginFooter />
    </View>
  );
}
