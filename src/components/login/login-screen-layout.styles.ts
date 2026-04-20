import { StyleSheet } from 'react-native';

import { LoginLayout, LoginPalette, LoginTypography } from '@/constants/login';

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
    marginTop: LoginLayout.titleTop,
    marginBottom: LoginLayout.fieldGap,
    paddingHorizontal: LoginLayout.horizontalInset,
    fontSize: LoginTypography.pageTitle,
    fontWeight: '700',
    color: LoginPalette.titleText,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: LoginLayout.horizontalInset,
  },
});
