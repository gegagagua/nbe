import type { EpsCaseExtraInfoItem } from '@/types/case-detail-api';
import type { CaseDetailExtraInfoRow } from '@/types/case-detail-data';

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
  /** Agency-provided fine detail rows (same shape as the logged-in "დამატებითი ინფორმაცია"). */
  appDtls?: EpsCaseExtraInfoItem[];
};

export type GuestFineCheckResult = {
  found: boolean;
  personName?: string;
  personIdnumber?: string;
  amount?: string;
  currency?: string;
  paymentUrl?: string | null;
  paymentContext?: GuestFinePaymentContext | null;
  /** Dynamic key/value fine details from `appDtls`, mapped to label/value rows. */
  details?: CaseDetailExtraInfoRow[];
};

export type GuestFinePaymentContext = {
  destType: string;
  appId: number;
  personId: number;
  amount: number;
};
