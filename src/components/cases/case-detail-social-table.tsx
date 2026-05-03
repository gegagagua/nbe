import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { CaseDetailLayoutMock } from '@/types/case-detail-mock';

import { caseDetailTableStyles as tb } from './case-detail-tables.styles';

export function CaseDetailSocialTable({ rows }: { rows: CaseDetailLayoutMock['socialRows'] }) {
  const { t } = useTranslation();
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
      {rows.map((row) => (
        <View key={row.nameId} style={tb.tableRow}>
          <Text style={tb.tableCell}>{row.nameId}</Text>
          <Text style={tb.tableCell}>{row.addressPhone}</Text>
          <Text style={[tb.tableCell, tb.tableHeadCellNarrow]}>{row.sent}</Text>
          <Text style={tb.tableCell}>{row.receivedAt}</Text>
          <Text style={tb.tableCell}>{row.status}</Text>
          <Text style={tb.tableCell}>{row.vulnerable}</Text>
        </View>
      ))}
    </View>
  );
}
