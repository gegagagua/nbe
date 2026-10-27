import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { LocaleToggle } from '@/components/i18n/locale-toggle';
import { AppSafeArea } from '@/components/ui/app-safe-area';
import type { LoginScreenLayoutProps } from '@/types/login';

import { LoginFooter } from './login-footer';

export function LoginScreenLayout({
  children,
  title,
  contentAlign = 'center',
}: LoginScreenLayoutProps) {
  const { t } = useTranslation();
  const resolvedTitle = title ?? t('login.pageTitle');

  return (
    <View className="flex-1 bg-bg">
      <AppSafeArea style={{ flex: 1 }}>
        {/* Title stays pinned at the top. The content below scrolls, so when the
            keyboard opens (or on short screens) the brand header + form scroll
            instead of overflowing upward and overlapping this title — the
            overlap reported on some iOS/Android devices. */}
        <View className="relative mt-4 min-h-[36px] justify-center px-6">
          <Text className="px-6 text-center text-title font-bold text-primary">
            {resolvedTitle}
          </Text>
          <View className="absolute inset-y-0 right-6 justify-center">
            <LocaleToggle />
          </View>
        </View>
        <KeyboardAwareScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: contentAlign === 'top' ? 'flex-start' : 'center',
            paddingHorizontal: 24,
            paddingTop: contentAlign === 'top' ? 16 : 0,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bottomOffset={16}>
          {children}
        </KeyboardAwareScrollView>
      </AppSafeArea>
      <LoginFooter />
    </View>
  );
}
