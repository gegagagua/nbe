import { StyleSheet } from 'react-native';

import {
  DebtorRegistryLayout,
  DebtorRegistryPalette,
  DebtorRegistryTypography,
} from '@/constants/debtor-registry';
import { Space } from '@/constants/theme';

export const casePayAmountFieldStyles = StyleSheet.create({
  payAmountWrap: {
    marginTop: Space.small,
    gap: Space.extraSmall,
  },
  payAmountLabel: {
    fontSize: DebtorRegistryTypography.label,
    fontWeight: '700',
    color: DebtorRegistryPalette.textPrimary,
  },
  payInput: {
    height: DebtorRegistryLayout.inputHeight + 8,
    borderWidth: 1,
    borderColor: DebtorRegistryPalette.inputBorder,
    borderRadius: DebtorRegistryLayout.buttonRadius,
    backgroundColor: DebtorRegistryPalette.inputBg,
    paddingHorizontal: Space.medium,
    fontSize: DebtorRegistryTypography.body,
    color: DebtorRegistryPalette.textPrimary,
  },
  payButton: {
    marginTop: Space.small,
    height: DebtorRegistryLayout.inputHeight + 8,
    borderRadius: DebtorRegistryLayout.buttonRadius,
    backgroundColor: DebtorRegistryPalette.buttonBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    fontSize: DebtorRegistryTypography.label,
    fontWeight: '700',
    color: DebtorRegistryPalette.buttonText,
  },
});
