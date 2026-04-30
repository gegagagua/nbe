import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

import { AppSafeArea } from '@/components/ui/app-safe-area';
import { ToastLayout } from '@/constants/toast';

import { caseDetailScreenStyles as s } from './case-detail-screen.styles';

export function CaseDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const caseId = Array.isArray(id) ? id[0] : id ?? '';

  const onPay = () => {
    Toast.show({
      type: 'info',
      text1: t('cases.detailPaySoonToast'),
      visibilityTime: ToastLayout.visibilityMs,
      position: 'top',
    });
  };

  return (
    <AppSafeArea style={s.page}>
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={s.headerRow}>
          <Pressable
            style={s.backBtn}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel={t('cases.detailBack')}>
            <Text style={s.backText}>{t('cases.detailBack')}</Text>
          </Pressable>
          <Text style={s.title} numberOfLines={2}>
            {t('cases.detailTitle')} #{caseId}
          </Text>
        </View>
        <View style={s.section}>
          <Text style={s.sectionTitle}>{t('cases.detailMyGovSection')}</Text>
          <Text style={s.sectionBody}>{t('cases.detailMyGovPlaceholder')}</Text>
        </View>
        <View style={s.section}>
          <Text style={s.sectionTitle}>{t('cases.detailDebtSection')}</Text>
          <Text style={s.sectionBody}>{t('cases.detailDebtPlaceholder')}</Text>
          <Pressable style={s.payButton} onPress={onPay} accessibilityRole="button">
            <Text style={s.payButtonText}>{t('cases.detailPayButton')}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </AppSafeArea>
  );
}
