import { ScrollView } from 'react-native';

import type { HomeDashboardLayoutProps } from '@/types/home-dashboard';

import { homeDashboardLayoutStyles } from './home-dashboard-layout.styles';

export function HomeDashboardLayout({ children }: HomeDashboardLayoutProps) {
  return (
    <ScrollView
      style={homeDashboardLayoutStyles.scroll}
      contentContainerStyle={homeDashboardLayoutStyles.scrollContent}
      keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  );
}
