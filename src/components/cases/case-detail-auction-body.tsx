import { Linking, Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { CaseDetailLayoutMock } from '@/types/case-detail-mock';

import { caseDetailInternalStyles as s } from './case-detail-internal.styles';
import { caseDetailPanelStyles as p } from './case-detail-panels.styles';
import { caseDetailTableStyles as tb } from './case-detail-tables.styles';

export function CaseDetailAuctionBody({ data }: { data: CaseDetailLayoutMock }) {
  const { t } = useTranslation();
  return (
    <View style={p.panel}>
      <Text style={p.panelTitle}>{t('cases.detail.auctionTitle')}</Text>
      <View style={tb.tableHead}>
        <Text style={tb.tableHeadCell}>{t('cases.detail.auctionColLot')}</Text>
        <Text style={[tb.tableHeadCell, tb.flex2]}>{t('cases.detail.auctionColDesc')}</Text>
        <Text style={tb.tableHeadCell}>{t('cases.detail.auctionColStatus')}</Text>
        <Text style={tb.tableHeadCell}>{t('cases.detail.auctionOpenEauction')}</Text>
      </View>
      {data.auctionLots.map((lot) => (
        <View key={lot.lotNo} style={tb.tableRow}>
          <Text style={tb.tableCell}>{lot.lotNo}</Text>
          <Text style={[tb.tableCell, tb.flex2]}>{lot.description}</Text>
          <Text style={tb.tableCell}>{lot.status}</Text>
          <View style={tb.tableCell}>
            <Pressable
              onPress={() => void Linking.openURL(lot.url)}
              accessibilityRole="link"
              accessibilityLabel={t('cases.detail.auctionOpenEauction')}>
              <Text style={s.linkText}>{t('cases.detail.auctionOpenEauction')}</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </View>
  );
}
