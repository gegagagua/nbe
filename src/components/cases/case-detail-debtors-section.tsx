import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useAppTheme } from '@/theme';
import type { CaseDetailData } from '@/types/case-detail-data';

import { CaseDetailPartyCell } from './case-detail-party-cell';

export function CaseDetailDebtorsSection({
  debtors,
}: {
  debtors: CaseDetailData['debtors'];
}) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const [open, setOpen] = useState(true);
  return (
    <View className="mb-4 overflow-hidden rounded-md border border-border bg-surface">
      <Pressable
        className="flex-row items-center justify-between border-b border-border p-2"
        onPress={() => setOpen((v) => !v)}>
        <Text className="text-label font-bold text-fg">{t('cases.detail.sectionDebtors')}</Text>
        <MaterialCommunityIcons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={22}
          color={colors.primary}
        />
      </Pressable>
      {open
        ? debtors.map((d, idx) => (
            <View key={`${d.titleLine}-${idx}`} className="flex-1 gap-1 border-b border-border p-2">
              <CaseDetailPartyCell
                party={{ titleLine: d.titleLine, addressLines: d.addressLines, paymentIdentifier: d.paymentIdentifier }}
              />
            </View>
          ))
        : null}
    </View>
  );
}
