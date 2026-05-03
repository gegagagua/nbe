import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { DebtorRegistryPalette } from '@/constants/debtor-registry';
import type { CaseDetailLayoutMock } from '@/types/case-detail-mock';

import { caseDetailInternalStyles as s } from './case-detail-internal.styles';
import { caseDetailPanelStyles as p } from './case-detail-panels.styles';
import { caseDetailTableStyles as tb } from './case-detail-tables.styles';

export function CaseDetailClaimsSection({
  claimsSummary,
  claimRows,
}: {
  claimsSummary: string;
  claimRows: CaseDetailLayoutMock['claimRows'];
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(true);
  return (
    <View style={p.panel}>
      <Pressable style={p.panelHeadRow} onPress={() => setOpen((v) => !v)}>
        <Text style={s.primaryText}>{t('cases.detail.sectionClaims')}</Text>
        <MaterialCommunityIcons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={22}
          color={DebtorRegistryPalette.buttonBg}
        />
      </Pressable>
      {open ? (
        <View style={tb.padSm}>
          <Text style={s.mutedText}>{claimsSummary}</Text>
          {claimRows.length > 0 ? (
            <View style={[tb.borderBox, s.claimsTableWrap]}>
              <View style={tb.tableHead}>
                <Text style={tb.tableHeadCell}>{t('cases.detail.colAmount')}</Text>
                <Text style={tb.tableHeadCell}>{t('cases.detail.colClaimCreditors')}</Text>
                <Text style={tb.tableHeadCell}>{t('cases.detail.colClaimDebtors')}</Text>
              </View>
              {claimRows.map((row) => (
                <View key={`${row.amount}-${row.creditorsCell}`} style={tb.tableRow}>
                  <Text style={tb.tableCell}>{row.amount}</Text>
                  <Text style={tb.tableCell}>{row.creditorsCell}</Text>
                  <Text style={tb.tableCell}>{row.debtorsCell}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
