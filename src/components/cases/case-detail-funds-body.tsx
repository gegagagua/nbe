import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { CaseDetailData } from '@/types/case-detail-data';

import { caseDetailInternalStyles as s } from './case-detail-internal.styles';
import { caseDetailPanelStyles as p } from './case-detail-panels.styles';

export function CaseDetailFundsBody({ data }: { data: CaseDetailData }) {
  const { t } = useTranslation();
  return (
    <View>
      <View style={p.panel}>
        <Text style={p.panelTitle}>{t('cases.detail.fundsSummaryTitle')}</Text>
        {data.fundsSummaryLines.map((line) => (
          <Text key={line} style={[s.mutedText, p.panelBodyPad]}>
            {line}
          </Text>
        ))}
      </View>
      <View style={p.panel}>
        <Text style={p.panelTitle}>{t('cases.detail.fundsCreditorTitle')}</Text>
        {data.fundsCreditor.bodyLines.map((line) => (
          <Text key={line} style={[s.mutedText, p.panelBodyPad]}>
            {line}
          </Text>
        ))}
      </View>
      <View style={p.panel}>
        <Text style={p.panelTitle}>{t('cases.detail.fundsDebtorTitle')}</Text>
        {data.fundsDebtor.bodyLines.map((line) => (
          <Text key={line} style={[s.mutedText, p.panelBodyPad]}>
            {line}
          </Text>
        ))}
      </View>
    </View>
  );
}
