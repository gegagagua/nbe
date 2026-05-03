import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { CaseDetailLayoutMock } from '@/types/case-detail-mock';

import { caseDetailInternalStyles as s } from './case-detail-internal.styles';
import { caseDetailPanelStyles as p } from './case-detail-panels.styles';

export function CaseDetailInstallmentBody({ data }: { data: CaseDetailLayoutMock }) {
  const { t } = useTranslation();
  return (
    <View style={p.panel}>
      <Text style={p.panelTitle}>{t('cases.detail.installmentTitle')}</Text>
      <Text style={[s.mutedText, p.panelBodyPad]}>{data.installmentNote}</Text>
    </View>
  );
}
