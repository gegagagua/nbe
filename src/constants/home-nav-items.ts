import { HomeDashboardCopy as C } from '@/constants/home-dashboard-copy';
import type { HomeNavItem } from '@/types/home-dashboard';

export const homeNavItems: HomeNavItem[] = [
  { id: 'cases', title: C.navCases, icon: 'briefcase', accent: 'red' },
  { id: 'debtors', title: C.navDebtors, icon: 'account-search', accent: 'slate' },
  { id: 'facts', title: C.navFacts, icon: 'file-document-outline', accent: 'red' },
  { id: 'assessment', title: C.navAssessment, icon: 'view-grid', accent: 'slate' },
  { id: 'practitioners', title: C.navPractitioners, icon: 'format-list-bulleted', accent: 'light' },
  { id: 'users', title: C.navUsers, icon: 'account-group-outline', accent: 'slate' },
];
