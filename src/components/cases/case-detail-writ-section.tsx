import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { CaseDetailData } from '@/types/case-detail-data';

export function CaseDetailWritSection({
  writRows,
}: {
  writRows: CaseDetailData['writRows'];
}) {
  const { t } = useTranslation();
  return (
    <View className="mb-4 overflow-hidden rounded-md border border-border bg-surface">
      <Text className="border-b border-border p-2 text-label font-bold text-primary">
        {t('cases.detail.sectionWrit')}
      </Text>
      <View className="flex-row border-b border-border bg-surface-sunken">
        <Text className="flex-1 p-2 text-caption text-fg">{t('cases.detail.colCourt')}</Text>
        <Text className="flex-1 p-2 text-caption text-fg">{t('cases.detail.colOrderNo')}</Text>
        <Text className="flex-1 p-2 text-caption text-fg">{t('cases.detail.colOrderDate')}</Text>
      </View>
      {writRows.map((row) => (
        <View key={`${row.orderNo}-${row.orderDate}`} className="flex-row border-b border-border">
          <Text className="flex-1 p-2 text-label">{row.court}</Text>
          <Text className="flex-1 p-2 text-label">{row.orderNo}</Text>
          <Text className="flex-1 p-2 text-label">{row.orderDate}</Text>
        </View>
      ))}
    </View>
  );
}
