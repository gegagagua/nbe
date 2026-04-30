import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { AppSafeArea } from '@/components/ui/app-safe-area';
import { CaseManagementCopy as C } from '@/constants/case-management-copy';
import { ToastLayout } from '@/constants/toast';

import { caseDetailScreenStyles as s } from './case-detail-screen.styles';

export function CaseDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const caseId = Array.isArray(id) ? id[0] : id ?? '';

  const onPay = () => {
    Toast.show({
      type: 'info',
      text1: C.detailPaySoonToast,
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
            accessibilityLabel={C.detailBack}>
            <Text style={s.backText}>{C.detailBack}</Text>
          </Pressable>
          <Text style={s.title} numberOfLines={2}>
            {C.detailTitle} #{caseId}
          </Text>
        </View>
        <View style={s.section}>
          <Text style={s.sectionTitle}>{C.detailMyGovSection}</Text>
          <Text style={s.sectionBody}>{C.detailMyGovPlaceholder}</Text>
        </View>
        <View style={s.section}>
          <Text style={s.sectionTitle}>{C.detailDebtSection}</Text>
          <Text style={s.sectionBody}>{C.detailDebtPlaceholder}</Text>
          <Pressable style={s.payButton} onPress={onPay} accessibilityRole="button">
            <Text style={s.payButtonText}>{C.detailPayButton}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </AppSafeArea>
  );
}
