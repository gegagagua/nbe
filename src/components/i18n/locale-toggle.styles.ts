import { StyleSheet } from 'react-native';

import { LoginPalette } from '@/constants/login';
import { FontSize, Radius, Spacing } from '@/constants/theme';

export const localeToggleStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderRadius: Radius.small,
    borderWidth: 1,
    borderColor: LoginPalette.inputBorder,
    overflow: 'hidden',
    backgroundColor: LoginPalette.inputFill,
  },
  segment: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
    minWidth: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: LoginPalette.primary,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: LoginPalette.bodyText,
  },
  labelActive: {
    color: LoginPalette.onPrimary,
  },
});
