import { StyleSheet } from 'react-native';

import { LoginPalette } from '@/constants/login';
import { Space, Typography } from '@/constants/theme';

export const loginScreenLayoutStyles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: LoginPalette.pageBackground,
  },
  body: {
    flex: 1,
  },
  title: {
    textAlign: 'center',
    marginTop: Space.large,
    marginBottom: Space.medium,
    paddingHorizontal: Space.large,
    fontSize: Typography.extraLarge,
    fontWeight: '700',
    color: LoginPalette.titleText,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Space.large,
  },
  centerTop: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: Space.medium,
    paddingHorizontal: Space.large,
  },
});
