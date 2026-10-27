import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { CaseDetailMainTab } from '@/types/case-detail-ui';

type Props = {
  value: CaseDetailMainTab;
  onChange: (v: CaseDetailMainTab) => void;
};

export function CaseDetailMainTabs({ value, onChange }: Props) {
  const { t } = useTranslation();
  const items: { key: CaseDetailMainTab; label: string }[] = [
    { key: 'application', label: t('cases.detail.tabApplication') },
    { key: 'caseInfo', label: t('cases.detail.tabCaseInfo') },
    { key: 'contact', label: t('cases.detail.tabContact') },
  ];
  return (
    <View className="mb-4 flex-row border-b border-border">
      {items.map((it) => {
        const active = value === it.key;
        return (
          <Pressable
            key={it.key}
            className={`flex-1 items-center border-b-2 py-2 ${
              active ? 'border-primary' : 'border-transparent'
            }`}
            onPress={() => onChange(it.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}>
            <Text
              className={`text-center text-label ${
                active ? 'font-bold text-primary' : 'text-fg-secondary'
              }`}
              numberOfLines={2}>
              {it.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
