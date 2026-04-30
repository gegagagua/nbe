import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { LoginCopy } from '@/constants/login-copy';
import { Layout } from '@/constants/layout';
import { LoginPalette } from '@/constants/login';
import type { RegisterScreenBodyProps } from '@/types/register';

import { registerNavRowStyles } from './register-nav-row.styles';

type RegisterNavRowProps = Pick<RegisterScreenBodyProps, 'onBack'>;

export function RegisterNavRow({ onBack }: RegisterNavRowProps) {
  return (
    <View style={registerNavRowStyles.row}>
      <Pressable
        style={registerNavRowStyles.hit}
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel={LoginCopy.registerBackA11yLabel}
        accessibilityHint={LoginCopy.pageTitle}>
        <MaterialCommunityIcons
          name="chevron-left"
          size={Layout.registerBackIconSize}
          color={LoginPalette.primary}
        />
        <Text style={registerNavRowStyles.backLabel}>
          {LoginCopy.pageTitle}
        </Text>
      </Pressable>
    </View>
  );
}
