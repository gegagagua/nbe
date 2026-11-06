import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useAppTheme } from '@/theme';
import type { CaseDetailData } from '@/types/case-detail-data';

export function CaseDetailClaimsSection({
  claimsSummary,
  claimRows,
}: {
  claimsSummary: string;
  claimRows: CaseDetailData['claimRows'];
}) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const [open, setOpen] = useState(true);
  return (
    <View className="mb-4 overflow-hidden rounded-md border border-border bg-surface">
      <Pressable
        className="flex-row items-center justify-between border-b border-border p-2"
        onPress={() => setOpen((v) => !v)}>
        <Text className="text-label font-bold text-fg">{t('cases.detail.sectionClaims')}</Text>
        <MaterialCommunityIcons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={22}
          color={colors.primary}
        />
      </Pressable>
      {open ? (
        <View className="p-2">
          <Text className="text-caption text-fg-secondary">{claimsSummary}</Text>
          {claimRows.length > 0 ? (
            <View className="mt-2 rounded-md border border-border">
              <View className="flex-row border-b border-border bg-surface-sunken">
                <Text className="flex-1 p-2 text-caption text-fg">{t('cases.detail.colAmount')}</Text>
                <Text className="flex-1 p-2 text-caption text-fg">{t('cases.detail.colClaimCreditors')}</Text>
                <Text className="flex-1 p-2 text-caption text-fg">{t('cases.detail.colClaimDebtors')}</Text>
              </View>
              {claimRows.map((row) => (
                <View key={`${row.amount}-${row.creditorsCell}`} className="flex-row border-b border-border">
                  <Text className="flex-1 p-2 text-label">{row.amount}</Text>
                  <Text className="flex-1 p-2 text-label">{row.creditorsCell}</Text>
                  <Text className="flex-1 p-2 text-label">{row.debtorsCell}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
