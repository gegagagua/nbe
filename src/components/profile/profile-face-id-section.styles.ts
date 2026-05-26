import { StyleSheet } from 'react-native';

import { HomeDashboardPalette } from '@/constants/home-dashboard';
import { LoginPalette } from '@/constants/login';
import { Radius, Space, Typography } from '@/constants/theme';

export const profileFaceIdSectionStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Space.medium,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowLabel: {
    fontSize: Typography.medium,
    color: LoginPalette.titleText,
    fontWeight: '600',
  },
  rowDescription: {
    fontSize: Typography.small,
    color: LoginPalette.placeholderMuted,
    lineHeight: 18,
  },
  warning: {
    fontSize: Typography.small,
    color: LoginPalette.errorText,
    lineHeight: 18,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    paddingHorizontal: Space.large,
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: Radius.medium,
    padding: Space.large,
    gap: Space.medium,
  },
  modalTitle: {
    fontSize: Typography.large,
    fontWeight: '700',
    color: LoginPalette.titleText,
  },
  modalDescription: {
    fontSize: Typography.small,
    color: HomeDashboardPalette.titleText,
    lineHeight: 18,
  },
  modalActions: {
    flexDirection: 'row',
    gap: Space.small,
  },
  fieldError: {
    fontSize: Typography.small,
    color: LoginPalette.errorText,
  },
});
