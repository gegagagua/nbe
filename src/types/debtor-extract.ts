export type DebtorExtractFlowPhase = 'form' | 'payment' | 'submit';

export type DebtorExtractPaymentMethod =
  | 'applePay'
  | 'googlePay'
  | 'bankTransfer'
  | 'bankOfGeorgia';

export type DebtorExtractPaymentOptionLabelKey =
  | 'debtors.extractMethodApplePay'
  | 'debtors.extractMethodGooglePay'
  | 'debtors.extractMethodBankTransfer'
  | 'debtors.extractMethodBankOfGeorgia';

export type DebtorExtractPaymentOption = {
  id: DebtorExtractPaymentMethod;
  labelKey: DebtorExtractPaymentOptionLabelKey;
  icon: string;
};
