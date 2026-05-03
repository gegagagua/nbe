import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { CaseDetailMainTab } from '@/types/case-detail-ui';

import { caseDetailInternalStyles as s } from './case-detail-internal.styles';

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
    <View style={s.tabRow}>
      {items.map((it) => {
        const active = value === it.key;
        return (
          <Pressable
            key={it.key}
            style={[s.tabBtn, active && s.tabBtnActive]}
            onPress={() => onChange(it.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}>
            <Text style={[s.tabLabel, active && s.tabLabelActive]} numberOfLines={2}>
              {it.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
