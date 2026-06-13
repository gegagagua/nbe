import { LoginPalette } from '@/constants/login';
import { FontSize, Space, Typography } from '@/constants/theme';

export const DebtorRegistryPalette = {
  pageBg: '#eef2f7',
  panelBg: '#f3f5f9',
  panelBorder: '#d8dee9',
  cardBg: '#ffffff',
  cardBorder: '#dde3ee',
  textPrimary: LoginPalette.primary,
  textSecondary: '#57637a',
  textMuted: '#7a869e',
  inputBorder: '#cfd8ea',
  inputBg: '#ffffff',
  buttonBg: LoginPalette.primary,
  buttonText: LoginPalette.onPrimary,
} as const;

export const DebtorRegistryLayout = {
  pageGap: Space.medium,
  panelRadius: 10,
  cardRadius: 10,
  buttonRadius: 8,
  panelWidthWeb: 250,
  listRowGap: Space.small,
  inputHeight: 36,
  modalRadius: 12,
  filterPanelIconSize: FontSize.xxl,
  extractCtaMinHeight: 52,
  paymentMethodIconWrap: 40,
  paymentMethodRadioRing: 22,
} as const;

export const DebtorRegistryTypography = {
  title: Typography.large,
  label: Typography.small,
  input: Typography.medium,
  body: Typography.small,
  small: Typography.extraSmall,
} as const;

