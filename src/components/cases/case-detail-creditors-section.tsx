import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { CaseDetailLayoutMock } from '@/types/case-detail-mock';

import { caseDetailInternalStyles as s } from './case-detail-internal.styles';
import { caseDetailPanelStyles as p } from './case-detail-panels.styles';
import { caseDetailTableStyles as tb } from './case-detail-tables.styles';
import { CaseDetailPartyCell } from './case-detail-party-cell';

export function CaseDetailCreditorsSection({
  creditors,
}: {
  creditors: CaseDetailLayoutMock['creditors'];
}) {
  const { t } = useTranslation();
  return (
    <View style={p.panel}>
      <Text style={p.panelTitle}>{t('cases.detail.sectionCreditors')}</Text>
      <View style={tb.tableHead}>
        <Text style={tb.tableHeadCell}>{t('cases.detail.colNameOrg')}</Text>
        <Text style={tb.tableHeadCell}>{t('cases.detail.colRepresentative')}</Text>
      </View>
      {creditors.map((row, idx) => (
        <View key={`${row.party.titleLine}-${idx}`} style={tb.tableRow}>
          <View style={tb.tableCell}>
            <CaseDetailPartyCell party={row.party} />
          </View>
          <View style={tb.tableCell}>
            {row.representative ? (
              <CaseDetailPartyCell party={row.representative} />
            ) : (
              <Text style={s.mutedText}>{t('cases.detail.emptyTable')}</Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}
