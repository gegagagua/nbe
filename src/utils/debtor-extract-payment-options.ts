import { Platform } from 'react-native';

import type {
  DebtorExtractPaymentMethod,
  DebtorExtractPaymentOption,
} from '@/types/debtor-extract';

const COMMON: DebtorExtractPaymentOption[] = [
  {
    id: 'bankTransfer',
    labelKey: 'debtors.extractMethodBankTransfer',
    icon: 'bank-transfer',
  },
  {
    id: 'bankOfGeorgia',
    labelKey: 'debtors.extractMethodBankOfGeorgia',
    icon: 'office-building-outline',
  },
];

export function getDebtorExtractPaymentOptions(): DebtorExtractPaymentOption[] {
  const wallet: DebtorExtractPaymentOption[] = [];
  if (Platform.OS === 'ios') {
    wallet.push({
      id: 'applePay',
      labelKey: 'debtors.extractMethodApplePay',
      icon: 'apple',
    });
  } else if (Platform.OS === 'android') {
    wallet.push({
      id: 'googlePay',
      labelKey: 'debtors.extractMethodGooglePay',
      icon: 'google',
    });
  }
  return [...wallet, ...COMMON];
}

export function defaultDebtorExtractPaymentMethod(): DebtorExtractPaymentMethod {
  const opts = getDebtorExtractPaymentOptions();
  return opts[0]?.id ?? 'bankTransfer';
}
