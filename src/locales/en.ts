import { enAuth } from '@/locales/fragments/en-auth';
import { enCases } from '@/locales/fragments/en-cases';
import { enCasesDetailUiA } from '@/locales/fragments/en-cases-detail-ui-a';
import { enCasesDetailUiB } from '@/locales/fragments/en-cases-detail-ui-b';
import { enDebtors } from '@/locales/fragments/en-debtors';
import { homeFaqItemsEn } from '@/locales/fragments/en-home-faq';
import { enHome } from '@/locales/fragments/en-home';
import { enChatTab } from '@/locales/fragments/en-chat-tab';
import { enContactTab } from '@/locales/fragments/en-contact-tab';
import { enHomeTabs } from '@/locales/fragments/en-home-tabs';
import { enToast } from '@/locales/fragments/en-toast';

export const en = {
  ...enAuth,
  cases: { ...enCases, detail: { ...enCasesDetailUiA, ...enCasesDetailUiB } },
  debtors: enDebtors,
  home: enHome,
  homeTabs: enHomeTabs,
  chatTab: enChatTab,
  contactTab: enContactTab,
  homeFaq: { items: [...homeFaqItemsEn] },
  toast: enToast,
} as const;
