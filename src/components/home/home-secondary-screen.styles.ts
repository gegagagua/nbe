import { StyleSheet } from 'react-native';

import { HomeTabsLayout, HomeTabsPalette } from '@/constants/home-tabs';

export const homeSecondaryScreenStyles = StyleSheet.create({
  card: {
    backgroundColor: HomeTabsPalette.surface,
    borderRadius: HomeTabsLayout.infoCardRadius,
    borderWidth: 1,
    borderColor: HomeTabsPalette.cardBorder,
    padding: HomeTabsLayout.infoCardPad,
    gap: HomeTabsLayout.sectionGap,
  },
  title: {
    color: HomeTabsPalette.inactiveText,
    fontSize: HomeTabsLayout.titleSize,
    fontWeight: '700',
  },
  description: {
    color: HomeTabsPalette.bodyText,
    fontSize: HomeTabsLayout.bodySize,
    lineHeight: HomeTabsLayout.lineHeight,
  },
  bullet: {
    color: HomeTabsPalette.bodyText,
    fontSize: HomeTabsLayout.bodySize,
    lineHeight: HomeTabsLayout.lineHeight,
  },
});
