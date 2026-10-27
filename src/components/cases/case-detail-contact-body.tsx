import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { CaseDetailData } from '@/types/case-detail-data';

export function CaseDetailContactBody({ contact }: { contact: CaseDetailData['contact'] }) {
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
    <View className="mb-4 overflow-hidden rounded-md border border-border bg-surface">
      {rows.map((r) => (
        <View key={r.label} className="border-b border-border px-4 py-2">
          <Text className="text-caption font-bold text-fg">{r.label}</Text>
          <Text className="mt-1 text-label text-fg-secondary">{r.value}</Text>
        </View>
      ))}
    </View>
  );
}
