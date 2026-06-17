import { StyleSheet } from 'react-native';

import { LoginPalette } from '@/constants/login';
import { LineHeight, Space, Typography } from '@/constants/theme';

export const loginFooterStyles = StyleSheet.create({
  bar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Space.medium,
    backgroundColor: LoginPalette.primary,
    paddingHorizontal: Space.large,
    paddingTop: Space.medium,
  },
  left: {
    flex: 1,
    color: LoginPalette.onPrimary,
    fontSize: Typography.small,
    lineHeight: LineHeight.normal,
  },
  version: {
    color: LoginPalette.onPrimary,
    fontSize: Typography.small,
    lineHeight: LineHeight.normal,
    opacity: 0.7,
  },
});
