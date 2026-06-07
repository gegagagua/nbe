export type GuestPersonType = 'physical' | 'legal';

export type PaymentInfoRequest = {
  idnumber: string;
  docNo: string;
};

export type GuestFineCheckResult = {
  found: boolean;
  amount?: string;
  currency?: string;
  paymentUrl?: string | null;
};
