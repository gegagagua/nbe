import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Pressable, Text } from 'react-native';

import { LoginPalette } from '@/constants/login';

import { caseDetailContactStyles as s } from './case-detail-contact.styles';

type Props = { onClose: () => void };

export function CaseDetailCloseRow({ onClose }: Props) {
  const { t } = useTranslation();
  return (
    <Pressable
      style={s.closeBtn}
      onPress={onClose}
      accessibilityRole="button"
      accessibilityLabel={t('cases.detail.closeCase')}>
      <Text style={s.closeBtnText}>{t('cases.detail.closeCase')}</Text>
      <MaterialCommunityIcons name="close" size={18} color={LoginPalette.logoRed} />
    </Pressable>
  );
}
