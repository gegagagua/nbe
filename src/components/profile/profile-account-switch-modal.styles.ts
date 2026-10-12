import { StyleSheet } from 'react-native';

import { LoginPalette } from '@/constants/login';
import { Radius, Space, Typography } from '@/constants/theme';

export const profileAccountSwitchModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: Radius.extraLarge,
    borderTopRightRadius: Radius.extraLarge,
    paddingHorizontal: Space.large,
    paddingTop: Space.small,
    paddingBottom: Space.extraLarge * 2,
    gap: Space.medium,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#d0d7e2',
  },
  title: {
    fontSize: Typography.medium,
    fontWeight: '700',
    color: LoginPalette.titleText,
  },
  loader: {
    paddingVertical: Space.large,
  },
  emptyText: {
    fontSize: Typography.medium,
    color: LoginPalette.placeholderMuted,
    textAlign: 'center',
    paddingVertical: Space.large,
  },
  scroll: {
    maxHeight: 360,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.medium,
    paddingVertical: Space.medium,
  },
  rowPressed: {
    opacity: 0.7,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: LoginPalette.placeholderMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: LoginPalette.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: LoginPalette.primary,
  },
  rowText: {
    flex: 1,
    fontSize: Typography.medium,
    fontWeight: '600',
    color: LoginPalette.bodyText,
    textTransform: 'uppercase',
  },
});
