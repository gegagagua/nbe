import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { CaseDetailLayoutMock } from '@/types/case-detail-mock';

import { caseDetailPanelStyles as p } from './case-detail-panels.styles';
import { caseDetailTableStyles as tb } from './case-detail-tables.styles';

export function CaseDetailWritSection({
  writRows,
}: {
  writRows: CaseDetailLayoutMock['writRows'];
}) {
  const { t } = useTranslation();
  return (
    <View style={p.panel}>
      <Text style={p.panelTitle}>{t('cases.detail.sectionWrit')}</Text>
      <View style={tb.tableHead}>
        <Text style={tb.tableHeadCell}>{t('cases.detail.colCourt')}</Text>
        <Text style={tb.tableHeadCell}>{t('cases.detail.colOrderNo')}</Text>
        <Text style={tb.tableHeadCell}>{t('cases.detail.colOrderDate')}</Text>
      </View>
      {writRows.map((row) => (
        <View key={`${row.orderNo}-${row.orderDate}`} style={tb.tableRow}>
          <Text style={tb.tableCell}>{row.court}</Text>
          <Text style={tb.tableCell}>{row.orderNo}</Text>
          <Text style={tb.tableCell}>{row.orderDate}</Text>
        </View>
      ))}
    </View>
  );
}
