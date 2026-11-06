import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { useThemePreference } from '@/components/theme/theme-preference-provider';
import type { ThemePreference } from '@/types/theme-preference';

const OPTIONS: { value: ThemePreference; labelKey: string }[] = [
  { value: 'system', labelKey: 'appearance.optionSystem' },
  { value: 'light', labelKey: 'appearance.optionLight' },
  { value: 'dark', labelKey: 'appearance.optionDark' },
];

export function ProfileAppearanceSection() {
  const { t } = useTranslation();
  const { preference, setPreference } = useThemePreference();

  return (
    <Card padding="lg" elevation="sm" className="gap-4 rounded-2xl">
      <View className="gap-0.5">
        <Text className="text-heading font-bold text-fg">
          {t('appearance.sectionTitle')}
        </Text>
        <Text className="text-label leading-[18px] text-fg-muted">
          {t('appearance.description')}
        </Text>
      </View>

      <View
        className="flex-row overflow-hidden rounded-sm border border-input-border bg-input"
        accessibilityRole="toolbar"
        accessibilityLabel={t('appearance.a11yLabel')}>
        {OPTIONS.map((option) => {
          const selected = preference === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => setPreference(option.value)}
              className={[
                'flex-1 items-center justify-center py-2 px-2',
                selected ? 'bg-primary' : '',
              ].join(' ')}
              accessibilityRole="button"
              accessibilityState={{ selected }}>
              <Text
                className={[
                  'text-label font-bold',
                  selected ? 'text-on-primary' : 'text-fg-secondary',
                ].join(' ')}>
                {t(option.labelKey)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Card>
  );
}
