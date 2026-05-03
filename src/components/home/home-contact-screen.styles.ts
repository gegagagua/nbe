import { StyleSheet } from 'react-native';

import { HomeTabsLayout, HomeTabsPalette } from '@/constants/home-tabs';
import { FontSize, Spacing } from '@/constants/theme';

export const homeContactScreenStyles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingTop: HomeTabsLayout.contentTopPad,
    paddingBottom: HomeTabsLayout.contentBottomPad,
    paddingHorizontal: Spacing.three,
    gap: Spacing.three,
  },
  screenTitle: {
    color: HomeTabsPalette.inactiveText,
    fontSize: HomeTabsLayout.titleSize,
    fontWeight: '700',
  },
  card: {
    backgroundColor: HomeTabsPalette.surface,
    borderRadius: HomeTabsLayout.infoCardRadius,
    borderWidth: 1,
    borderColor: HomeTabsPalette.cardBorder,
    padding: HomeTabsLayout.infoCardPad,
    gap: Spacing.two,
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  cardTitle: {
    color: HomeTabsPalette.inactiveText,
    fontSize: FontSize.lg,
    fontWeight: '600',
    flex: 1,
  },
  cardBody: {
    color: HomeTabsPalette.bodyText,
    fontSize: HomeTabsLayout.bodySize,
    lineHeight: HomeTabsLayout.lineHeight,
  },
  phoneRowsWrap: {
    gap: Spacing.three,
  },
  phoneRow: {
    gap: Spacing.half,
  },
  phoneRowLabel: {
    color: HomeTabsPalette.bodyText,
    fontSize: FontSize.sm,
    lineHeight: HomeTabsLayout.lineHeight,
  },
  phonePress: {
    alignSelf: 'flex-start',
  },
  phoneValuePrimary: {
    color: HomeTabsPalette.activeBg,
    fontSize: FontSize.xxl,
    fontWeight: '700',
  },
  phoneValueSecondary: {
    color: HomeTabsPalette.activeBg,
    fontSize: HomeTabsLayout.bodySize,
    lineHeight: HomeTabsLayout.lineHeight,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  linkPress: {
    alignSelf: 'flex-start',
  },
  linkText: {
    color: HomeTabsPalette.activeBg,
    fontSize: HomeTabsLayout.bodySize,
    lineHeight: HomeTabsLayout.lineHeight,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  socialRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  socialPress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: HomeTabsLayout.tabRadius,
    borderWidth: 1,
    borderColor: HomeTabsPalette.cardBorder,
    backgroundColor: HomeTabsPalette.faqQuestionBg,
  },
  socialLabel: {
    color: HomeTabsPalette.bodyText,
    fontSize: HomeTabsLayout.bodySize,
    fontWeight: '600',
  },
});
