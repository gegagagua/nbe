import { Pressable, Text, View } from 'react-native';

import { LoginCopy } from '@/constants/login-copy';
import type { RegisterSegmentedTabsProps } from '@/types/register';

import { registerSegmentedTabsStyles } from './register-segmented-tabs.styles';

export function RegisterSegmentedTabs({
  value,
  onChange,
}: RegisterSegmentedTabsProps) {
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
          {LoginCopy.registerTabPhysical}
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
          {LoginCopy.registerTabLegal}
        </Text>
      </Pressable>
    </View>
  );
}
