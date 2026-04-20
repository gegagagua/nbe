import { FontSize, Spacing } from '@/constants/theme';

export const LoginPalette = {
  pageBackground: '#f0f0f0',
  cardBackground: '#ffffff',
  primary: '#2b436c',
  inputFill: '#e8f0fe',
  inputBorder: '#cfd8ea',
  titleText: '#2b436c',
  bodyText: '#1e2a3d',
  onPrimary: '#ffffff',
  logoRed: '#c41e3a',
  logoBlue: '#2b436c',
  placeholderMuted: '#6b7a90',
  errorText: '#b42318',
} as const;

export const LoginRadius = {
  card: 12,
  field: 8,
  button: 8,
} as const;

export const LoginLayout = {
  cardMaxWidth: 420,
  titleTop: Spacing.four,
  horizontalInset: Spacing.four,
  cardPadding: Spacing.four,
  fieldGap: Spacing.three,
  inputPaddingVertical: Spacing.three,
  inputPaddingHorizontal: Spacing.three,
  logoMarkSize: 40,
  logoMarkGap: Spacing.two,
  brandTextGap: Spacing.one,
  logoMarkInnerRadius: Spacing.one,
  buttonPaddingVertical: 14,
  agencyMarkSize: 28,
  agencyMarkRadius: Spacing.two,
  footerPaddingTop: Spacing.three,
  footerRightMaxWidth: '42%',
} as const;

export const LoginElevation = {
  cardShadowOpacity: 0.14,
  cardShadowRadius: 18,
  cardShadowOffsetY: 6,
  cardAndroidElevation: 8,
} as const;

export const LoginInteraction = {
  pressedOpacity: 0.92,
  agencyMarkOpacity: 0.95,
} as const;

export const LoginTypography = {
  pageTitle: FontSize.xxl,
  button: FontSize.xl,
  input: FontSize.xl,
  footer: FontSize.sm,
  brandGeo: FontSize.xs,
  brandEn: FontSize.xss,
  agencyMark: FontSize.xs,
  footerLineHeight: 18,
  agencyLineHeight: 16,
  fieldValidation: FontSize.sm,
} as const;
