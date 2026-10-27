import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { PressableScale } from '@/components/ui/pressable-scale';
import { useAppTheme } from '@/theme';
import type { RegisterScreenBodyProps } from '@/types/register';

type RegisterNavRowProps = Pick<RegisterScreenBodyProps, 'onBack'>;

export function RegisterNavRow({ onBack }: RegisterNavRowProps) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();

  return (
    <View className="mb-4 self-stretch">
      <PressableScale
        haptic="none"
        pressedScale={0.98}
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel={t('login.registerBackA11yLabel')}
        accessibilityHint={t('login.pageTitle')}
        className="flex-row items-center gap-1 self-start pr-4">
        <MaterialCommunityIcons name="chevron-left" size={24} color={colors.primary} />
        <Text className="text-body font-semibold text-primary">{t('login.pageTitle')}</Text>
      </PressableScale>
    </View>
  );
}
