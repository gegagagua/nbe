import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { DebtorRegistryPalette } from '@/constants/debtor-registry';
import { useBusinessRegistry } from '@/hooks/use-business-registry';

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
      <View style={tb.tableHead}>
        <Text style={tb.tableHeadCell}>{t('cases.detail.bizColDebtor')}</Text>
        <Text style={tb.tableHeadCell}>{t('cases.detail.bizColInitiator')}</Text>
        <Text style={tb.tableHeadCell}>{t('cases.detail.bizColCreated')}</Text>
        <Text style={tb.tableHeadCellNarrow}>{t('cases.detail.bizColSent')}</Text>
        <Text style={tb.tableHeadCell}>{t('cases.detail.bizColResponse')}</Text>
        <Text style={tb.tableHeadCell}>{t('cases.detail.bizColIe')}</Text>
      </View>
      {notify.length === 0 ? (
        <Text style={[s.mutedText, tb.padSm]}>{t('cases.detail.emptyTable')}</Text>
      ) : (
        notify.map((row, i) => (
          <View key={`${row.createdAt}-${row.debtor}-${i}`} style={tb.tableRow}>
            <Text style={tb.tableCell}>{row.debtor}</Text>
            <Text style={tb.tableCell}>{row.initiator}</Text>
            <Text style={tb.tableCell}>{row.createdAt || t('cases.detail.emptyTable')}</Text>
            <Text style={[tb.tableCell, tb.tableHeadCellNarrow]}>
              {row.sent ? '✓' : t('cases.detail.emptyTable')}
            </Text>
            <Text style={tb.tableCell}>{row.response || t('cases.detail.emptyTable')}</Text>
            <Text style={tb.tableCell}>
              {row.soleProp ? t('cases.detail.socialYes') : t('cases.detail.socialNo')}
            </Text>
          </View>
        ))
      )}
      <Text style={tb.subSectionTitle}>{t('cases.detail.businessSharesTitle')}</Text>
      <View style={tb.tableHead}>
        <Text style={tb.tableHeadCell}>{t('cases.detail.shareColOwner')}</Text>
        <Text style={tb.tableHeadCell}>{t('cases.detail.shareColTitle')}</Text>
        <Text style={tb.tableHeadCell}>{t('cases.detail.shareColOrgNo')}</Text>
        <Text style={tb.tableHeadCell}>{t('cases.detail.shareColRegDate')}</Text>
        <Text style={tb.tableHeadCellNarrow}>{t('cases.detail.shareColShare')}</Text>
        <Text style={tb.tableHeadCell}>{t('cases.detail.shareColStatus')}</Text>
      </View>
      {shares.length === 0 ? (
        <Text style={[s.mutedText, tb.padSm]}>{t('cases.detail.emptyTable')}</Text>
      ) : (
        shares.map((row, i) => (
          <View key={`${row.orgNo}-${i}`} style={tb.tableRow}>
            <Text style={tb.tableCell}>{row.owner}</Text>
            <Text style={tb.tableCell}>{row.title}</Text>
            <Text style={tb.tableCell}>{row.orgNo || t('cases.detail.emptyTable')}</Text>
            <Text style={tb.tableCell}>{row.regDate || t('cases.detail.emptyTable')}</Text>
            <Text style={[tb.tableCell, tb.tableHeadCellNarrow]}>{row.share || t('cases.detail.emptyTable')}</Text>
            <Text style={tb.tableCell}>{row.status || t('cases.detail.emptyTable')}</Text>
          </View>
        ))
      )}
    </View>
  );
}
