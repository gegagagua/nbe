import { StyleSheet } from 'react-native';

import { LoginPalette } from '@/constants/login';
import { Radius, Space, Typography } from '@/constants/theme';

export const profileInfoSheetModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Space.large,
  },
  sheet: {
    backgroundColor: '#ffffff',
    borderRadius: Radius.large,
    padding: Space.large,
    width: '100%',
    maxWidth: 480,
    gap: Space.medium,
  },
  title: {
    fontSize: Typography.large,
    fontWeight: '700',
    color: LoginPalette.titleText,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: Typography.medium,
    color: LoginPalette.placeholderMuted,
    textAlign: 'center',
    paddingVertical: Space.medium,
  },
  scroll: {
    maxHeight: 360,
  },
  closeButton: {
    backgroundColor: LoginPalette.primary,
    borderRadius: Radius.small,
    paddingVertical: Space.small,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: Typography.medium,
    fontWeight: '600',
  },
});
