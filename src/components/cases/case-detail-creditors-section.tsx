import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { CaseDetailData } from '@/types/case-detail-data';

import { CaseDetailPartyCell } from './case-detail-party-cell';

export function CaseDetailCreditorsSection({
  creditors,
}: {
  creditors: CaseDetailData['creditors'];
}) {
  const { t } = useTranslation();
  return (
    <View className="mb-4 overflow-hidden rounded-md border border-border bg-surface">
      <Text className="border-b border-border p-2 text-label font-bold text-primary">
        {t('cases.detail.sectionCreditors')}
      </Text>
      <View className="flex-row border-b border-border bg-surface-sunken">
        <Text className="flex-1 p-2 text-caption text-fg">{t('cases.detail.colNameOrg')}</Text>
        <Text className="flex-1 p-2 text-caption text-fg">{t('cases.detail.colRepresentative')}</Text>
      </View>
      {creditors.map((row, idx) => (
        <View key={`${row.party.titleLine}-${idx}`} className="flex-row border-b border-border">
          <View className="flex-1 gap-1 p-2">
            <CaseDetailPartyCell party={row.party} />
          </View>
          <View className="flex-1 gap-1 p-2">
            {row.representative ? (
              <CaseDetailPartyCell party={row.representative} />
            ) : (
              <Text className="text-caption text-fg-secondary">{t('cases.detail.emptyTable')}</Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}
