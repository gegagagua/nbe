import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable } from 'react-native';

import { HomeDashboardLayoutConst, HomeDashboardPalette } from '@/constants/home-dashboard';
import { HomeDashboardCopy } from '@/constants/home-dashboard-copy';

import { homeHelpFabStyles } from './home-help-fab.styles';

export function HomeHelpFab() {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={HomeDashboardCopy.helpFabA11y}
      style={homeHelpFabStyles.fab}>
      <MaterialCommunityIcons
        name="book-open-variant"
        size={HomeDashboardLayoutConst.headerProfileIconSize}
        color={HomeDashboardPalette.titleText}
      />
    </Pressable>
  );
}
