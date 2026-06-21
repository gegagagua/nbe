import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { DebtorRegistryPalette } from '@/constants/debtor-registry';
import { useRegistrySearch } from '@/hooks/use-registry-search';

import { caseDetailInternalStyles as s } from './case-detail-internal.styles';
import { caseDetailTableStyles as tb } from './case-detail-tables.styles';

export function CaseDetailRegistryTables() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const appId = Array.isArray(id) ? id[0] : (id ?? '');
  const { data, isLoading } = useRegistrySearch(appId);

  if (isLoading) {
    return (
      <View style={tb.padSm}>
        <ActivityIndicator color={DebtorRegistryPalette.buttonBg} />
      </View>
    );
  }

  const infos = data?.infos ?? [];
  const estates = data?.estates ?? [];

  return (
    <View>
      <Text style={tb.subSectionTitle}>{t('cases.detail.regRequestsTitle')}</Text>
      <View style={tb.tableHead}>
        <Text style={[tb.tableHeadCell, tb.flex2]}>{t('cases.detail.socialColPerson')}</Text>
        <Text style={tb.tableHeadCellNarrow}>{t('cases.detail.socialColSent')}</Text>
        <Text style={tb.tableHeadCell}>{t('cases.detail.socialColReceived')}</Text>
        <Text style={tb.tableHeadCell}>{t('cases.detail.socialColStatus')}</Text>
      </View>
      {infos.length === 0 ? (
        <Text style={[s.mutedText, tb.padSm]}>{t('cases.detail.emptyTable')}</Text>
      ) : (
        infos.map((row, i) => (
          <View key={`${row.person}-${i}`} style={tb.tableRow}>
            <Text style={[tb.tableCell, tb.flex2]}>{row.person}</Text>
            <Text style={[tb.tableCell, tb.tableHeadCellNarrow]}>
              {row.sent ? '✓' : t('cases.detail.emptyTable')}
            </Text>
            <Text style={tb.tableCell}>{row.sentDate || t('cases.detail.emptyTable')}</Text>
            <Text style={tb.tableCell}>
              {row.found ? t('cases.detail.regFound') : t('cases.detail.regNotFound')}
            </Text>
          </View>
        ))
      )}

      <Text style={tb.subSectionTitle}>{t('cases.detail.subFoundProperty')}</Text>
      <View style={tb.tableHead}>
        <Text style={tb.tableHeadCell}>{t('cases.detail.regColCadCode')}</Text>
        <Text style={[tb.tableHeadCell, tb.flex2]}>{t('cases.detail.regColAddress')}</Text>
        <Text style={tb.tableHeadCellNarrow}>{t('cases.detail.regColOwner')}</Text>
        <Text style={tb.tableHeadCell}>{t('cases.detail.socialColStatus')}</Text>
      </View>
      {estates.length === 0 ? (
        <Text style={[s.mutedText, tb.padSm]}>{t('cases.detail.emptyTable')}</Text>
      ) : (
        estates.map((row, i) => (
          <View key={`${row.cadCode}-${i}`} style={tb.tableRow}>
            <Text style={tb.tableCell}>{row.cadCode || t('cases.detail.emptyTable')}</Text>
            <Text style={[tb.tableCell, tb.flex2]}>{row.address || t('cases.detail.emptyTable')}</Text>
            <Text style={[tb.tableCell, tb.tableHeadCellNarrow]}>
              {row.owner ? t('cases.detail.socialYes') : t('cases.detail.socialNo')}
            </Text>
            <Text style={tb.tableCell}>{row.status || t('cases.detail.emptyTable')}</Text>
          </View>
        ))
      )}
    </View>
  );
}
