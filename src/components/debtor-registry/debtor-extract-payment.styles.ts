import { Platform, StyleSheet } from 'react-native';

import {
  DebtorRegistryLayout,
  DebtorRegistryPalette,
  DebtorRegistryTypography,
} from '@/constants/debtor-registry';
import { ApplePayBrand, BankOfGeorgiaBrand } from '@/constants/payment-brands';
import { Space } from '@/constants/theme';

const methodShadow =
  Platform.OS === 'ios'
    ? {
        shadowColor: DebtorRegistryPalette.textPrimary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      }
    : Platform.OS === 'android'
      ? { elevation: 3 }
      : {};

export const debtorExtractPaymentStyles = StyleSheet.create({
  feeCard: {
    backgroundColor: DebtorRegistryPalette.panelBg,
    borderRadius: DebtorRegistryLayout.cardRadius,
    borderWidth: 1,
    borderColor: DebtorRegistryPalette.textPrimary,
    padding: Space.large,
    alignItems: 'center',
    gap: Space.extraSmall,
    ...methodShadow,
  },
  feeLabel: {
    fontSize: DebtorRegistryTypography.label,
    fontWeight: '600',
    color: DebtorRegistryPalette.textSecondary,
  },
  feeAmount: {
    fontSize: DebtorRegistryTypography.title,
    fontWeight: '800',
    color: DebtorRegistryPalette.textPrimary,
  },
  methodsTitle: {
    fontSize: DebtorRegistryTypography.body,
    fontWeight: '700',
    color: DebtorRegistryPalette.textPrimary,
    marginBottom: Space.extraSmall,
  },
  methodsList: {
    gap: Space.medium,
  },
  methodPress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.medium,
    paddingVertical: Space.medium,
    paddingHorizontal: Space.medium,
    borderRadius: DebtorRegistryLayout.cardRadius,
    borderWidth: 1,
    borderColor: DebtorRegistryPalette.cardBorder,
    backgroundColor: DebtorRegistryPalette.cardBg,
    minHeight: DebtorRegistryLayout.extractCtaMinHeight,
    ...methodShadow,
  },
  methodPressSelected: {
    borderWidth: 2,
    borderColor: DebtorRegistryPalette.textPrimary,
    backgroundColor: DebtorRegistryPalette.panelBg,
  },
  methodIconWrap: {
    width: DebtorRegistryLayout.paymentMethodIconWrap,
    height: DebtorRegistryLayout.paymentMethodIconWrap,
    borderRadius: DebtorRegistryLayout.buttonRadius,
    backgroundColor: DebtorRegistryPalette.panelBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: DebtorRegistryPalette.panelBorder,
  },
  methodIconApplePay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: ApplePayBrand.markMinWidth,
    height: DebtorRegistryLayout.paymentMethodIconWrap,
    paddingHorizontal: Space.small,
    gap: Space.extraSmall,
    borderRadius: DebtorRegistryLayout.buttonRadius,
    backgroundColor: ApplePayBrand.background,
  },
  methodIconApplePayLabel: {
    fontSize: DebtorRegistryTypography.small,
    fontWeight: '700',
    letterSpacing: 0.3,
    color: ApplePayBrand.onBackground,
  },
  methodIconBog: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    overflow: 'hidden',
  },
  methodAccentBog: {
    borderLeftWidth: 4,
    borderLeftColor: BankOfGeorgiaBrand.primary,
  },
  methodAccentApplePay: {
    borderLeftWidth: 4,
    borderLeftColor: ApplePayBrand.background,
  },
  methodLabel: {
    flex: 1,
    fontSize: DebtorRegistryTypography.input,
    fontWeight: '600',
    color: DebtorRegistryPalette.textPrimary,
  },
  methodRadioOuter: {
    width: DebtorRegistryLayout.paymentMethodRadioRing,
    height: DebtorRegistryLayout.paymentMethodRadioRing,
    borderRadius: DebtorRegistryLayout.paymentMethodRadioRing / 2,
    borderWidth: 2,
    borderColor: DebtorRegistryPalette.inputBorder,
  },
  summaryCard: {
    backgroundColor: DebtorRegistryPalette.panelBg,
    borderRadius: DebtorRegistryLayout.cardRadius,
    borderWidth: 1,
    borderColor: DebtorRegistryPalette.panelBorder,
    padding: Space.medium,
    gap: Space.medium,
  },
  summaryRow: {
    gap: Space.extraSmall,
  },
  summaryLabel: {
    fontSize: DebtorRegistryTypography.label,
    fontWeight: '600',
    color: DebtorRegistryPalette.textSecondary,
  },
  summaryValue: {
    fontSize: DebtorRegistryTypography.input,
    fontWeight: '700',
    color: DebtorRegistryPalette.textPrimary,
  },
});
