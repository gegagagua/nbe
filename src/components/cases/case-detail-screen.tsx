import { useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { getCaseDetailLayoutMock } from '@/constants/case-detail-layout-mock';
import type { CaseDetailMainTab } from '@/types/case-detail-ui';

import { AppSafeArea } from '@/components/ui/app-safe-area';

import { caseDetailScreenStyles as layout } from './case-detail-screen.styles';
import { CaseDetailApplicationTab } from './case-detail-application-tab';
import { CaseDetailCloseRow } from './case-detail-close-row';
import { CaseDetailContactBody } from './case-detail-contact-body';
import { CaseDetailHeaderSummary } from './case-detail-header-summary';
import { CaseDetailInfoTab } from './case-detail-info-tab';
import { CaseDetailMainTabs } from './case-detail-main-tabs';

export function CaseDetailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const caseId = Array.isArray(id) ? id[0] : id ?? '';
  const data = useMemo(() => getCaseDetailLayoutMock(caseId), [caseId]);
  const [tab, setTab] = useState<CaseDetailMainTab>('application');

  return (
    <AppSafeArea style={layout.page}>
      <ScrollView contentContainerStyle={layout.scroll}>
        <View style={layout.headerRow}>
          <Pressable
            style={layout.backBtn}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel={t('cases.detailBack')}>
            <Text style={layout.backText}>{t('cases.detailBack')}</Text>
          </Pressable>
          <Text style={layout.title} numberOfLines={1}>
            {t('cases.detailTitle')}
          </Text>
        </View>
        <CaseDetailHeaderSummary data={data} />
        <CaseDetailMainTabs value={tab} onChange={setTab} />
        {tab === 'application' ? <CaseDetailApplicationTab data={data} /> : null}
        {tab === 'caseInfo' ? <CaseDetailInfoTab data={data} /> : null}
        {tab === 'contact' ? <CaseDetailContactBody contact={data.contact} /> : null}
        <CaseDetailCloseRow onClose={() => router.back()} />
      </ScrollView>
    </AppSafeArea>
  );
}
