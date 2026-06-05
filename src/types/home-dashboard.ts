import type { ReactNode } from 'react';

export type HomeDashboardLayoutProps = {
  children: ReactNode;
};

export type HomeNavAccent = 'red' | 'slate' | 'light';

export type HomeNavTitleKey =
  | 'home.navCases'
  | 'home.navSimplified'
  | 'home.navFacts'
  | 'home.navAssessment'
  | 'home.navDebtors';

export type HomeNavItem = {
  id: string;
  titleKey: HomeNavTitleKey;
  icon: string;
  accent: HomeNavAccent;
  disabled?: boolean;
  hiddenForGuest?: boolean;
};

export type HomeHeaderProps = {
  displayName: string;
};

export type HomeNavCardProps = {
  item: HomeNavItem;
  onPress?: () => void;
  fullWidth?: boolean;
};
