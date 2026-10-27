import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { CaseGuestFinePanel } from '@/components/cases/case-guest-fine-panel';
import { AppHeader } from '@/components/ui/app-header';

export function CaseGuestFineScreen() {
  const { t } = useTranslation();

  return (
    <View className="flex-1 bg-bg">
      <AppHeader title={t('cases.pageTitle')} onBack={() => router.back()} />
      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bottomOffset={16}>
        <CaseGuestFinePanel />
      </KeyboardAwareScrollView>
    </View>
  );
}
