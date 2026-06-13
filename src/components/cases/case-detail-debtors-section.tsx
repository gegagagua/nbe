import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { DebtorRegistryPalette } from '@/constants/debtor-registry';
import type { CaseDetailData } from '@/types/case-detail-data';

import { caseDetailInternalStyles as s } from './case-detail-internal.styles';
import { caseDetailPanelStyles as p } from './case-detail-panels.styles';
import { caseDetailTableStyles as tb } from './case-detail-tables.styles';
import { CaseDetailPartyCell } from './case-detail-party-cell';

export function CaseDetailDebtorsSection({
  debtors,
}: {
  debtors: CaseDetailData['debtors'];
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(true);
  return (
    <View style={p.panel}>
      <Pressable style={p.panelHeadRow} onPress={() => setOpen((v) => !v)}>
        <Text style={s.primaryText}>{t('cases.detail.sectionDebtors')}</Text>
        <MaterialCommunityIcons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={22}
          color={DebtorRegistryPalette.buttonBg}
        />
      </Pressable>
      {open
        ? debtors.map((d, idx) => (
            <View key={`${d.titleLine}-${idx}`} style={[tb.tableCell, tb.padSm, tb.borderBottom]}>
              <CaseDetailPartyCell
                party={{ titleLine: d.titleLine, addressLines: d.addressLines, paymentIdentifier: d.paymentIdentifier }}
              />
            </View>
          ))
        : null}
    </View>
  );
}
