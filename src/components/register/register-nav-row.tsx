import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Layout } from '@/constants/layout';
import { LoginPalette } from '@/constants/login';
import type { RegisterScreenBodyProps } from '@/types/register';

import { registerNavRowStyles } from './register-nav-row.styles';

type RegisterNavRowProps = Pick<RegisterScreenBodyProps, 'onBack'>;

export function RegisterNavRow({ onBack }: RegisterNavRowProps) {
  const { t } = useTranslation();

  return (
    <View style={registerNavRowStyles.row}>
      <Pressable
        style={registerNavRowStyles.hit}
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel={t('login.registerBackA11yLabel')}
        accessibilityHint={t('login.pageTitle')}>
        <MaterialCommunityIcons
          name="chevron-left"
          size={Layout.registerBackIconSize}
          color={LoginPalette.primary}
        />
        <Text style={registerNavRowStyles.backLabel}>
          {t('login.pageTitle')}
        </Text>
      </Pressable>
    </View>
  );
}
