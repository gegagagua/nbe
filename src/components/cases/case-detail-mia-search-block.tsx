import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { CaseDetailLayoutMock } from '@/types/case-detail-mock';

import { caseDetailInternalStyles as s } from './case-detail-internal.styles';
import { caseDetailTableStyles as tb } from './case-detail-tables.styles';

export function CaseDetailMiaSearchBlock({
  block,
}: {
  block: CaseDetailLayoutMock['searchMiaCreditor'];
}) {
  const { t } = useTranslation();
  return (
    <View>
      <Text style={tb.subSectionTitle}>{t('cases.detail.subFoundProperty')}</Text>
      <View style={tb.tableHead}>
        <Text style={[tb.tableHeadCell, tb.flex2]}>{t('cases.detail.searchColNameObject')}</Text>
        <Text style={tb.tableHeadCell}>{t('cases.detail.searchColOrder')}</Text>
        <Text style={tb.tableHeadCell}>{t('cases.detail.searchColInitiator')}</Text>
        <Text style={tb.tableHeadCell}>{t('cases.detail.searchColProperty')}</Text>
      </View>
      {block.foundProperty.length === 0 ? (
        <Text style={[s.mutedText, tb.padSm]}>{t('cases.detail.emptyTable')}</Text>
      ) : (
        block.foundProperty.map((row) => (
          <View key={`${row.orderRef}-${row.nameObject}`} style={tb.tableRow}>
            <View style={[tb.tableCell, tb.flex2]}>
              <Text style={s.primaryText}>{row.nameObject}</Text>
              {row.plateOrExtra ? <Text style={s.mutedText}>{row.plateOrExtra}</Text> : null}
            </View>
            <View style={tb.tableCell}>
              <Text style={s.primaryText}>{row.orderRef}</Text>
              <Text style={s.mutedText}>{row.orderAction}</Text>
            </View>
            <View style={tb.tableCell}>
              <Text style={s.primaryText}>{row.initiator}</Text>
              <Text style={s.mutedText}>{row.initiatorWhen}</Text>
            </View>
            <Text style={tb.tableCell}>{t('cases.detail.emptyTable')}</Text>
          </View>
        ))
      )}
      <Text style={tb.subSectionTitle}>{t('cases.detail.subRestrictions')}</Text>
      <Text style={[s.mutedText, tb.padSm]}>{block.restrictionsPlaceholder}</Text>
    </View>
  );
}
