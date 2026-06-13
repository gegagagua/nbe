import { StyleSheet } from 'react-native';

import { LoginPalette } from '@/constants/login';
import { Radius, Space, Typography } from '@/constants/theme';

export const paymentWebViewModalStyles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: LoginPalette.pageBackground,
  },
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Space.medium,
    marginBottom: Space.small,
  },
  closeHit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.extraSmall,
    paddingVertical: Space.small,
    paddingRight: Space.medium,
  },
  closeLabel: {
    color: LoginPalette.primary,
    fontSize: Typography.medium,
    fontWeight: '600',
  },
  webviewWrap: {
    flex: 1,
    marginHorizontal: Space.medium,
    borderRadius: Radius.small,
    overflow: 'hidden',
    backgroundColor: LoginPalette.cardBackground,
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: LoginPalette.cardBackground,
  },
});
