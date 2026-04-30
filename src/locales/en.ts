import { enAuth } from '@/locales/fragments/en-auth';
import { enCases } from '@/locales/fragments/en-cases';
import { enDebtors } from '@/locales/fragments/en-debtors';
import { homeFaqItemsEn } from '@/locales/fragments/en-home-faq';
import { enHome } from '@/locales/fragments/en-home';
import { enHomeTabs } from '@/locales/fragments/en-home-tabs';
import { enToast } from '@/locales/fragments/en-toast';

export const en = {
  ...enAuth,
  cases: enCases,
  debtors: enDebtors,
  home: enHome,
  homeTabs: enHomeTabs,
  homeFaq: { items: [...homeFaqItemsEn] },
  toast: enToast,
} as const;
