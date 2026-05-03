import { kaAuth } from '@/locales/fragments/ka-auth';
import { kaCases } from '@/locales/fragments/ka-cases';
import { kaCasesDetailUiA } from '@/locales/fragments/ka-cases-detail-ui-a';
import { kaCasesDetailUiB } from '@/locales/fragments/ka-cases-detail-ui-b';
import { kaDebtors } from '@/locales/fragments/ka-debtors';
import { homeFaqItemsKa } from '@/locales/fragments/ka-home-faq';
import { kaHome } from '@/locales/fragments/ka-home';
import { kaChatTab } from '@/locales/fragments/ka-chat-tab';
import { kaContactTab } from '@/locales/fragments/ka-contact-tab';
import { kaHomeTabs } from '@/locales/fragments/ka-home-tabs';
import { kaToast } from '@/locales/fragments/ka-toast';

export const ka = {
  ...kaAuth,
  cases: { ...kaCases, detail: { ...kaCasesDetailUiA, ...kaCasesDetailUiB } },
  debtors: kaDebtors,
  home: kaHome,
  homeTabs: kaHomeTabs,
  chatTab: kaChatTab,
  contactTab: kaContactTab,
  homeFaq: { items: [...homeFaqItemsKa] },
  toast: kaToast,
} as const;
