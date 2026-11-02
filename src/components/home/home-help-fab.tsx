import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useAppTheme } from '@/theme';

export function HomeHelpFab() {
  const { t } = useTranslation();
  const { colors, shadows } = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('home.helpFabA11y')}
      className="absolute right-6 h-11 w-11 items-center justify-center rounded-sm border border-border bg-surface"
      style={[{ bottom: 112 }, shadows.md]}>
      <MaterialCommunityIcons
        name="book-open-variant"
        size={28}
        color={colors.primary}
      />
    </Pressable>
  );
}
