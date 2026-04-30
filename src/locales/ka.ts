import { kaAuth } from '@/locales/fragments/ka-auth';
import { kaCases } from '@/locales/fragments/ka-cases';
import { kaDebtors } from '@/locales/fragments/ka-debtors';
import { homeFaqItemsKa } from '@/locales/fragments/ka-home-faq';
import { kaHome } from '@/locales/fragments/ka-home';
import { kaHomeTabs } from '@/locales/fragments/ka-home-tabs';
import { kaToast } from '@/locales/fragments/ka-toast';

export const ka = {
  ...kaAuth,
  cases: kaCases,
  debtors: kaDebtors,
  home: kaHome,
  homeTabs: kaHomeTabs,
  homeFaq: { items: [...homeFaqItemsKa] },
  toast: kaToast,
} as const;
