import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { DebtorRegistryPalette } from '@/constants/debtor-registry';
import type { CaseDetailData } from '@/types/case-detail-data';

import { CaseDetailProceedingFiles } from './case-detail-proceeding-files';
import { caseDetailInternalStyles as s } from './case-detail-internal.styles';
import { caseDetailPanelStyles as p } from './case-detail-panels.styles';
import { caseDetailTableStyles as tb } from './case-detail-tables.styles';

export function CaseDetailProceedingsList({
  proceedings,
}: {
  proceedings: CaseDetailData['proceedings'];
}) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState<number | null>(null);
  return (
    <View>
      {proceedings.map((row, idx) => {
        const isOpen = expanded === idx;
        return (
          <View key={`${row.codeLine}-${idx}`} style={p.panel}>
            <Pressable
              style={p.panelHeadRow}
              onPress={() => setExpanded(isOpen ? null : idx)}>
              <Text style={s.primaryText}>
                {row.codeLine ? `${row.codeLine} :: ${row.title}` : row.title}
              </Text>
              <MaterialCommunityIcons
                name={isOpen ? 'chevron-up' : 'chevron-down'}
                size={22}
                color={DebtorRegistryPalette.buttonBg}
              />
            </Pressable>
            <View style={tb.padSm}>
              <Text style={s.mutedText}>{row.dateTime}</Text>
              {isOpen ? (
                row.appStatusId != null ? (
                  <CaseDetailProceedingFiles
                    appId={row.appId}
                    appStatusId={row.appStatusId}
                  />
                ) : row.documents.length === 0 ? (
                  <Text style={[s.mutedText, s.stackGapSm]}>{t('cases.detail.proceedingsNoDocs')}</Text>
                ) : (
                  <View style={[tb.borderBox, s.claimsTableWrap]}>
                    <View style={tb.tableHead}>
                      <Text style={tb.tableHeadCell}>{t('cases.detail.colDocument')}</Text>
                      <Text style={tb.tableHeadCell}>{t('cases.detail.colActor')}</Text>
                    </View>
                    {row.documents.map((doc, di) => (
                      <View key={`${row.codeLine}-${di}-${doc.href}`} style={tb.tableRow}>
                        <View style={tb.tableCell}>
                          <Pressable
                            onPress={() => Linking.openURL(doc.href)}
                            accessibilityRole="link"
                            accessibilityLabel={t('cases.detail.docOpenA11y')}>
                            <Text style={s.linkText}>{doc.title}</Text>
                          </Pressable>
                        </View>
                        <Text style={tb.tableCell}>{doc.actor}</Text>
                      </View>
                    ))}
                  </View>
                )
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}
