import { Text, View } from 'react-native';

import { LoginCopy } from '@/constants/login-copy';
import type { LoginScreenLayoutProps } from '@/types/login';
import { AppSafeArea } from '@/components/ui/app-safe-area';

import { LoginFooter } from './login-footer';
import { loginScreenLayoutStyles } from './login-screen-layout.styles';

export function LoginScreenLayout({
  children,
  title = LoginCopy.pageTitle,
  contentAlign = 'center',
}: LoginScreenLayoutProps) {
  const mainStyle =
    contentAlign === 'top'
      ? loginScreenLayoutStyles.centerTop
      : loginScreenLayoutStyles.center;

  return (
    <View style={loginScreenLayoutStyles.page}>
      <AppSafeArea style={loginScreenLayoutStyles.body}>
        <Text style={loginScreenLayoutStyles.title}>{title}</Text>
        <View style={mainStyle}>{children}</View>
      </AppSafeArea>
      <LoginFooter />
    </View>
  );
}
