import { StyleSheet } from 'react-native';

import { LoginPalette } from '@/constants/login';
import { Radius, Space, Typography } from '@/constants/theme';

export const forcedPasswordChangeModalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    paddingHorizontal: Space.large,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: Radius.medium,
    padding: Space.large,
    gap: Space.medium,
  },
  title: {
    fontSize: Typography.large,
    fontWeight: '700',
    color: LoginPalette.bodyText,
  },
  subtitle: {
    fontSize: Typography.small,
    color: LoginPalette.placeholderMuted,
    lineHeight: 20,
  },
  requirementsHint: {
    fontSize: Typography.small,
    color: LoginPalette.placeholderMuted,
    lineHeight: 18,
  },
  fields: {
    gap: Space.small,
  },
  errorText: {
    fontSize: Typography.extraSmall,
    color: LoginPalette.errorText,
  },
  loadingWrap: {
    alignItems: 'center',
    paddingVertical: Space.medium,
  },
});
