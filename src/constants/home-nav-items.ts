import { HomeDashboardCopy as C } from '@/constants/home-dashboard-copy';
import type { HomeNavItem } from '@/types/home-dashboard';

export const homeNavItems: HomeNavItem[] = [
  { id: 'cases', title: C.navCases, icon: 'briefcase', accent: 'red' },
  {
    id: 'simplified',
    title: C.navSimplified,
    icon: 'file-document-edit-outline',
    accent: 'light',
    disabled: true,
  },
  {
    id: 'facts',
    title: C.navFacts,
    icon: 'file-document-outline',
    accent: 'red',
    disabled: true,
  },
  {
    id: 'assessment',
    title: C.navAssessment,
    icon: 'view-grid',
    accent: 'slate',
    disabled: true,
  },
  { id: 'debtors', title: C.navDebtors, icon: 'account-search', accent: 'slate' },
];
