import type { ReactNode } from 'react';

export type HomeDashboardLayoutProps = {
  children: ReactNode;
};

export type HomeNavAccent = 'red' | 'slate' | 'light';

export type HomeNavItem = {
  id: string;
  title: string;
  icon: string;
  accent: HomeNavAccent;
};

export type HomeHeaderProps = {
  displayName: string;
};

export type HomeNavCardProps = {
  item: HomeNavItem;
  onPress?: () => void;
};
