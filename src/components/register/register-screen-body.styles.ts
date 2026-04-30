import { StyleSheet } from 'react-native';

import { Layout } from '@/constants/layout';
import { LoginElevation, LoginPalette } from '@/constants/login';
import { Radius, Space } from '@/constants/theme';

export const registerScreenBodyStyles = StyleSheet.create({
  scroll: {
    flex: 1,
    alignSelf: 'stretch',
    width: '100%',
    maxWidth: Layout.cardMaxWidth,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Space.medium,
  },
  card: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: LoginPalette.cardBackground,
    borderRadius: Radius.medium,
    padding: Space.large,
    shadowColor: LoginPalette.primary,
    shadowOffset: { width: 0, height: LoginElevation.cardShadowOffsetY },
    shadowOpacity: LoginElevation.cardShadowOpacity,
    shadowRadius: LoginElevation.cardShadowRadius,
    elevation: LoginElevation.cardAndroidElevation,
  },
});
