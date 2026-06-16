export type BogPaymentMethod = 'CARD' | 'APPLE_PAY';

export type BogPaymentIntentRequest = {
  destType: string;
  appId: number;
  personId: number;
  amount: number;
  paymentMethod: BogPaymentMethod;
};

export type BogPaymentIntentResult = {
  paymentUrl: string;
  paymentIntentId: string | null;
};
