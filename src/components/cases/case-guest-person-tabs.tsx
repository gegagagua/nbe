import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { GuestPersonType } from '@/types/guest-fine';

type Props = {
  value: GuestPersonType;
  onChange: (value: GuestPersonType) => void;
};

export function CaseGuestPersonTabs({ value, onChange }: Props) {
  const { t } = useTranslation();

  return (
    <View className="flex-row gap-1 mb-4">
      <Pressable
        className={`flex-1 items-center rounded-sm border py-1 ${
          value === 'physical'
            ? 'border-primary bg-primary'
            : 'border-border bg-input'
        }`}
        onPress={() => onChange('physical')}
        accessibilityRole="tab"
        accessibilityState={{ selected: value === 'physical' }}>
        <Text
          className={`py-2 text-center text-body ${
            value === 'physical' ? 'font-semibold text-on-primary' : 'text-fg'
          }`}>
          {t('login.registerTabPhysical')}
        </Text>
      </Pressable>
      <Pressable
        className={`flex-1 items-center rounded-sm border py-1 ${
          value === 'legal'
            ? 'border-primary bg-primary'
            : 'border-border bg-input'
        }`}
        onPress={() => onChange('legal')}
        accessibilityRole="tab"
        accessibilityState={{ selected: value === 'legal' }}>
        <Text
          className={`py-2 text-center text-body ${
            value === 'legal' ? 'font-semibold text-on-primary' : 'text-fg'
          }`}>
          {t('login.registerTabLegal')}
        </Text>
      </Pressable>
    </View>
  );
}
