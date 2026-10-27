import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Pressable, Text } from 'react-native';

import { useAppTheme } from '@/theme';

type Props = { onClose: () => void };

export function CaseDetailCloseRow({ onClose }: Props) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  return (
    <Pressable
      className="mt-4 flex-row items-center gap-1 self-start rounded-sm border border-danger px-4 py-2"
      onPress={onClose}
      accessibilityRole="button"
      accessibilityLabel={t('cases.detail.closeCase')}>
      <Text className="text-label font-semibold text-danger">{t('cases.detail.closeCase')}</Text>
      <MaterialCommunityIcons name="close" size={18} color={colors.danger} />
    </Pressable>
  );
}
