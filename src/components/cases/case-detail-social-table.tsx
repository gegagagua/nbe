import { useLocalSearchParams } from 'expo-router';
import { ActivityIndicator, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { DebtorRegistryPalette } from '@/constants/debtor-registry';
import { useSsaRequests } from '@/hooks/use-ssa-requests';

import { caseDetailInternalStyles as s } from './case-detail-internal.styles';
import { caseDetailTableStyles as tb } from './case-detail-tables.styles';

export function CaseDetailSocialTable() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const appId = Array.isArray(id) ? id[0] : (id ?? '');
  const { data: rows, isLoading } = useSsaRequests(appId);
  return (
    <View>
      <View style={tb.tableHead}>
        <Text style={tb.tableHeadCell}>{t('cases.detail.socialColPerson')}</Text>
        <Text style={tb.tableHeadCell}>{t('cases.detail.socialColAddressPhone')}</Text>
        <Text style={tb.tableHeadCellNarrow}>{t('cases.detail.socialColSent')}</Text>
        <Text style={tb.tableHeadCell}>{t('cases.detail.socialColReceived')}</Text>
        <Text style={tb.tableHeadCell}>{t('cases.detail.socialColStatus')}</Text>
        <Text style={tb.tableHeadCell}>{t('cases.detail.socialColVulnerable')}</Text>
      </View>
      {isLoading ? (
        <View style={tb.padSm}>
          <ActivityIndicator color={DebtorRegistryPalette.buttonBg} />
        </View>
      ) : !rows || rows.length === 0 ? (
        <Text style={[s.mutedText, tb.padSm]}>{t('cases.detail.socialEmpty')}</Text>
      ) : (
        rows.map((row, i) => (
          <View key={`${row.nameId}-${i}`} style={tb.tableRow}>
            <Text style={tb.tableCell}>{row.nameId}</Text>
            <Text style={tb.tableCell}>{row.addressPhone || t('cases.detail.emptyTable')}</Text>
            <Text style={[tb.tableCell, tb.tableHeadCellNarrow]}>
              {row.sent ? '✓' : t('cases.detail.emptyTable')}
            </Text>
            <Text style={tb.tableCell}>{row.receivedAt || t('cases.detail.emptyTable')}</Text>
            <Text style={tb.tableCell}>
              {row.active ? t('cases.detail.socialStatusActive') : t('cases.detail.socialStatusInactive')}
            </Text>
            <Text style={tb.tableCell}>
              {row.vulnerable ? t('cases.detail.socialYes') : t('cases.detail.socialNo')}
            </Text>
          </View>
        ))
      )}
    </View>
  );
}
