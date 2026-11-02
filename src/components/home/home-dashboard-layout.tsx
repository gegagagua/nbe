import { ScrollView } from 'react-native';

import type { HomeDashboardLayoutProps } from '@/types/home-dashboard';

export function HomeDashboardLayout({ children }: HomeDashboardLayoutProps) {
  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="grow px-4 pt-2 pb-6"
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  );
}
