import type { HomeNavItem } from '@/types/home-dashboard';

export const homeNavItems: HomeNavItem[] = [
  { id: 'cases', titleKey: 'home.navCases', icon: 'briefcase', accent: 'red' },
  {
    id: 'simplified',
    titleKey: 'home.navSimplified',
    icon: 'file-document-edit-outline',
    accent: 'light',
    disabled: true,
  },
  {
    id: 'facts',
    titleKey: 'home.navFacts',
    icon: 'file-document-outline',
    accent: 'red',
    disabled: true,
    hiddenForGuest: true,
  },
  {
    id: 'assessment',
    titleKey: 'home.navAssessment',
    icon: 'view-grid',
    accent: 'slate',
    disabled: true,
  },
  { id: 'debtors', titleKey: 'home.navDebtors', icon: 'account-search', accent: 'slate' },
];
