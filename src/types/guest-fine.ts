export type GuestPersonType = 'physical' | 'legal';

export type GuestFineCheckRequest = {
  personType: GuestPersonType;
  idNumber: string;
  documentNumber: string;
  categoryCode: string;
};

export type GuestFineCheckResult = {
  found: boolean;
  amount?: string;
  currency?: string;
  paymentUrl?: string | null;
};
