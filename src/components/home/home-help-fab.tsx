import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';

import { HomeDashboardLayoutConst, HomeDashboardPalette } from '@/constants/home-dashboard';

import { homeHelpFabStyles } from './home-help-fab.styles';

export function HomeHelpFab() {
  const { t } = useTranslation();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('home.helpFabA11y')}
      style={homeHelpFabStyles.fab}>
      <MaterialCommunityIcons
        name="book-open-variant"
        size={HomeDashboardLayoutConst.headerProfileIconSize}
        color={HomeDashboardPalette.titleText}
      />
    </Pressable>
  );
}
