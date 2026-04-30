import { Platform, StyleSheet } from 'react-native';

import { LoginPalette } from '@/constants/login';
import { LetterSpacing } from '@/constants/letter-spacing';
import { LineHeight, Space, Typography } from '@/constants/theme';

export const loginBrandHeaderStyles = StyleSheet.create({
  container: {
    marginBottom: Space.medium,
    alignItems: 'center',
  },
  title: {
    fontSize: Typography.large,
    fontWeight: '700',
    color: LoginPalette.titleText,
    textAlign: 'center',
    lineHeight: LineHeight.comfortable,
    marginTop: Platform.select({
      ios: Space.large,
      default: Space.medium,
    }),
    letterSpacing: Platform.select({
      ios: LetterSpacing.brandTitleIos,
      default: LetterSpacing.none,
    }),
  },
});
