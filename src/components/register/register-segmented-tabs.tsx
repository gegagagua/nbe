import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { RegisterSegmentedTabsProps } from '@/types/register';

import { registerSegmentedTabsStyles } from './register-segmented-tabs.styles';

export function RegisterSegmentedTabs({
  value,
  onChange,
}: RegisterSegmentedTabsProps) {
  const { t } = useTranslation();

  return (
    <View style={registerSegmentedTabsStyles.row}>
      <Pressable
        style={[
          registerSegmentedTabsStyles.tab,
          value === 'physical' && registerSegmentedTabsStyles.tabSelected,
        ]}
        onPress={() => onChange('physical')}
        accessibilityRole="tab"
        accessibilityState={{ selected: value === 'physical' }}>
        <Text
          style={[
            registerSegmentedTabsStyles.tabLabel,
            value === 'physical' &&
              registerSegmentedTabsStyles.tabLabelSelected,
          ]}>
          {t('login.registerTabPhysical')}
        </Text>
      </Pressable>
      <Pressable
        style={[
          registerSegmentedTabsStyles.tab,
          value === 'legal' && registerSegmentedTabsStyles.tabSelected,
        ]}
        onPress={() => onChange('legal')}
        accessibilityRole="tab"
        accessibilityState={{ selected: value === 'legal' }}>
        <Text
          style={[
            registerSegmentedTabsStyles.tabLabel,
            value === 'legal' && registerSegmentedTabsStyles.tabLabelSelected,
          ]}>
          {t('login.registerTabLegal')}
        </Text>
      </Pressable>
    </View>
  );
}
