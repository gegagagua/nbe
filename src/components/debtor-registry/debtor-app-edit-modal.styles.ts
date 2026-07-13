import { StyleSheet } from 'react-native';

import {
  DebtorRegistryLayout,
  DebtorRegistryPalette,
  DebtorRegistryTypography,
} from '@/constants/debtor-registry';
import { LoginPalette } from '@/constants/login';
import { Radius, Space } from '@/constants/theme';

export const debtorAppEditModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Space.large,
  },
  sheet: {
    backgroundColor: DebtorRegistryPalette.cardBg,
    borderRadius: Radius.large,
    padding: Space.large,
    width: '100%',
    maxWidth: 480,
    gap: Space.medium,
  },
  title: {
    fontSize: DebtorRegistryTypography.title,
    fontWeight: '700',
    color: DebtorRegistryPalette.textPrimary,
    textAlign: 'center',
  },
  fieldGap: {
    gap: Space.small,
  },
  label: {
    fontSize: DebtorRegistryTypography.label,
    fontWeight: '600',
    color: DebtorRegistryPalette.textSecondary,
  },
  input: {
    borderWidth: 1,
    borderColor: DebtorRegistryPalette.inputBorder,
    backgroundColor: DebtorRegistryPalette.inputBg,
    borderRadius: DebtorRegistryLayout.buttonRadius,
    paddingHorizontal: Space.medium,
    paddingVertical: Space.small,
    fontSize: DebtorRegistryTypography.input,
    color: DebtorRegistryPalette.textPrimary,
    minHeight: DebtorRegistryLayout.inputHeight,
  },
  inputError: {
    borderColor: LoginPalette.errorText,
  },
  errorText: {
    fontSize: DebtorRegistryTypography.small,
    color: LoginPalette.errorText,
  },
  actions: {
    flexDirection: 'row',
    gap: Space.small,
    marginTop: Space.small,
  },
  btn: {
    flex: 1,
    minHeight: DebtorRegistryLayout.inputHeight,
    borderRadius: DebtorRegistryLayout.buttonRadius,
    borderWidth: 1,
    borderColor: DebtorRegistryPalette.buttonBg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Space.small,
  },
  cancelBtn: {
    backgroundColor: DebtorRegistryPalette.panelBg,
  },
  saveBtn: {
    backgroundColor: DebtorRegistryPalette.buttonBg,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  cancelLabel: {
    fontSize: DebtorRegistryTypography.label,
    fontWeight: '700',
    color: DebtorRegistryPalette.buttonBg,
  },
  saveLabel: {
    fontSize: DebtorRegistryTypography.label,
    fontWeight: '700',
    color: LoginPalette.onPrimary,
  },
});
