import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import type {
  RegisterScreenBodyProps,
  RegisterTabKind,
} from '@/types/register';

import { RegisterNavRow } from './register-nav-row';
import { registerScreenBodyStyles } from './register-screen-body.styles';
import { RegisterSegmentedTabs } from './register-segmented-tabs';
import { RegisterTabContent } from './register-tab-content';

export function RegisterScreenBody({ onBack }: RegisterScreenBodyProps) {
  const [tab, setTab] = useState<RegisterTabKind>('physical');

  return (
    <ScrollView
      style={registerScreenBodyStyles.scroll}
      contentContainerStyle={registerScreenBodyStyles.scrollContent}
      keyboardShouldPersistTaps="handled">
      <RegisterNavRow onBack={onBack} />
      <View style={registerScreenBodyStyles.card}>
        <RegisterSegmentedTabs value={tab} onChange={setTab} />
        <RegisterTabContent tab={tab} />
      </View>
    </ScrollView>
  );
}
