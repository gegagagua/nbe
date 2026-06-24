import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { DebtorRegistryPalette } from '@/constants/debtor-registry';
import { useBusinessRegistry } from '@/hooks/use-business-registry';

import { CaseDetailKvCard, CaseDetailKvCardList } from './case-detail-kv-card';
import { caseDetailInternalStyles as s } from './case-detail-internal.styles';
import { caseDetailTableStyles as tb } from './case-detail-tables.styles';

export function CaseDetailBusinessTables() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const appId = Array.isArray(id) ? id[0] : (id ?? '');
  const { data, isLoading } = useBusinessRegistry(appId);

  if (isLoading) {
    return (
      <View style={tb.padSm}>
        <ActivityIndicator color={DebtorRegistryPalette.buttonBg} />
      </View>
    );
  }

  const notify = data?.notify ?? [];
  const shares = data?.shares ?? [];

  return (
    <View>
      <Text style={tb.subSectionTitle}>{t('cases.detail.businessNotifyTitle')}</Text>
      {notify.length === 0 ? (
        <Text style={[s.mutedText, tb.padSm]}>{t('cases.detail.emptyTable')}</Text>
      ) : (
        <CaseDetailKvCardList>
          {notify.map((row, i) => (
            <CaseDetailKvCard
              key={`${row.createdAt}-${row.debtor}-${i}`}
              rows={[
                { label: t('cases.detail.bizColDebtor'), value: row.debtor },
                { label: t('cases.detail.bizColInitiator'), value: row.initiator },
                {
                  label: t('cases.detail.bizColCreated'),
                  value: row.createdAt || t('cases.detail.emptyTable'),
                },
                {
                  label: t('cases.detail.bizColSent'),
                  value: row.sent ? '✓' : t('cases.detail.emptyTable'),
                },
                {
                  label: t('cases.detail.bizColResponse'),
                  value: row.response || t('cases.detail.emptyTable'),
                },
                {
                  label: t('cases.detail.bizColIe'),
                  value: row.soleProp ? t('cases.detail.socialYes') : t('cases.detail.socialNo'),
                },
              ]}
            />
          ))}
        </CaseDetailKvCardList>
      )}
      <Text style={tb.subSectionTitle}>{t('cases.detail.businessSharesTitle')}</Text>
      {shares.length === 0 ? (
        <Text style={[s.mutedText, tb.padSm]}>{t('cases.detail.emptyTable')}</Text>
      ) : (
        <CaseDetailKvCardList>
          {shares.map((row, i) => (
            <CaseDetailKvCard
              key={`${row.orgNo}-${i}`}
              rows={[
                { label: t('cases.detail.shareColOwner'), value: row.owner },
                { label: t('cases.detail.shareColTitle'), value: row.title },
                {
                  label: t('cases.detail.shareColOrgNo'),
                  value: row.orgNo || t('cases.detail.emptyTable'),
                },
                {
                  label: t('cases.detail.shareColRegDate'),
                  value: row.regDate || t('cases.detail.emptyTable'),
                },
                {
                  label: t('cases.detail.shareColShare'),
                  value: row.share || t('cases.detail.emptyTable'),
                },
                {
                  label: t('cases.detail.shareColStatus'),
                  value: row.status || t('cases.detail.emptyTable'),
                },
              ]}
            />
          ))}
        </CaseDetailKvCardList>
      )}
    </View>
  );
}
