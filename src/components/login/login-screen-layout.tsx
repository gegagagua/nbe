import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { LocaleToggle } from '@/components/i18n/locale-toggle';
import { AppSafeArea } from '@/components/ui/app-safe-area';
import type { LoginScreenLayoutProps } from '@/types/login';

import { LoginFooter } from './login-footer';
import { loginScreenLayoutStyles } from './login-screen-layout.styles';

export function LoginScreenLayout({
  children,
  title,
  contentAlign = 'center',
}: LoginScreenLayoutProps) {
  const { t } = useTranslation();
  const mainStyle =
    contentAlign === 'top'
      ? loginScreenLayoutStyles.centerTop
      : loginScreenLayoutStyles.center;
  const resolvedTitle = title ?? t('login.pageTitle');

  return (
    <View style={loginScreenLayoutStyles.page}>
      <AppSafeArea style={loginScreenLayoutStyles.body}>
        <View style={loginScreenLayoutStyles.titleWrap}>
          <Text style={loginScreenLayoutStyles.title}>{resolvedTitle}</Text>
          <View style={loginScreenLayoutStyles.langSlot}>
            <LocaleToggle />
          </View>
        </View>
        <View style={mainStyle}>{children}</View>
      </AppSafeArea>
      <LoginFooter />
    </View>
  );
}
