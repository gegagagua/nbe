import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { GuestPersonType } from '@/types/guest-fine';

import { registerSegmentedTabsStyles as s } from '../register/register-segmented-tabs.styles';

type Props = {
  value: GuestPersonType;
  onChange: (value: GuestPersonType) => void;
};

export function CaseGuestPersonTabs({ value, onChange }: Props) {
  const { t } = useTranslation();

  return (
    <View style={s.row}>
      <Pressable
        style={[s.tab, value === 'physical' && s.tabSelected]}
        onPress={() => onChange('physical')}
        accessibilityRole="tab"
        accessibilityState={{ selected: value === 'physical' }}>
        <Text style={[s.tabLabel, value === 'physical' && s.tabLabelSelected]}>
          {t('login.registerTabPhysical')}
        </Text>
      </Pressable>
      <Pressable
        style={[s.tab, value === 'legal' && s.tabSelected]}
        onPress={() => onChange('legal')}
        accessibilityRole="tab"
        accessibilityState={{ selected: value === 'legal' }}>
        <Text style={[s.tabLabel, value === 'legal' && s.tabLabelSelected]}>
          {t('login.registerTabLegal')}
        </Text>
      </Pressable>
    </View>
  );
}
