export type GuestPersonType = 'physical' | 'legal';

export type PaymentInfoRequest = {
  idnumber: string;
  docNo: string;
};

export type PaymentInfoPerson = {
  personId?: number;
  idnumber?: string;
  name?: string;
};

export type PaymentInfoItem = {
  destType?: string;
  appId?: number;
  amount?: number;
  person?: PaymentInfoPerson;
};

export type GuestFineCheckResult = {
  found: boolean;
  personName?: string;
  amount?: string;
  currency?: string;
  paymentUrl?: string | null;
};
