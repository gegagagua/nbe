import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { CaseGuestFinePanel } from '@/components/cases/case-guest-fine-panel';
import { HomeHeader } from '@/components/home/home-header';
import { LoginFooter } from '@/components/login/login-footer';
import { AppSafeArea } from '@/components/ui/app-safe-area';

import { caseScreenStyles as s } from './case-screen.styles';

export function CaseGuestFineScreen() {
  const { t } = useTranslation();

  return (
    <View style={s.page}>
      <AppSafeArea style={s.body}>
        <HomeHeader displayName="" />
        <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator>
          <View style={s.titleRow}>
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              style={s.backButton}>
              <MaterialCommunityIcons name="arrow-left" size={22} color="#2b436c" />
            </Pressable>
            <Text style={s.title}>{t('cases.pageTitle')}</Text>
          </View>
          <CaseGuestFinePanel />
        </ScrollView>
      </AppSafeArea>
      <LoginFooter />
    </View>
  );
}
