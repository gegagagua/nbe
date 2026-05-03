import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { CaseDetailLayoutMock } from '@/types/case-detail-mock';

import { caseDetailContactStyles as c } from './case-detail-contact.styles';
import { caseDetailPanelStyles as p } from './case-detail-panels.styles';

export function CaseDetailContactBody({ contact }: { contact: CaseDetailLayoutMock['contact'] }) {
  const { t } = useTranslation();
  const rows: { label: string; value: string }[] = [
    { label: t('cases.detail.contactBureau'), value: contact.bureau },
    { label: t('cases.detail.contactAddress'), value: contact.address },
    { label: t('cases.detail.contactPhone'), value: contact.phone },
    { label: t('cases.detail.contactEmail'), value: contact.email },
    { label: t('cases.detail.contactFax'), value: contact.fax },
    { label: t('cases.detail.contactWebsite'), value: contact.website },
  ];
  return (
    <View style={p.panel}>
      {rows.map((r) => (
        <View key={r.label} style={c.contactRow}>
          <Text style={c.contactLabel}>{r.label}</Text>
          <Text style={c.contactValue}>{r.value}</Text>
        </View>
      ))}
    </View>
  );
}
