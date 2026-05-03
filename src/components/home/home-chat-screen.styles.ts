import { StyleSheet } from 'react-native';

import { HomeTabsLayout, HomeTabsPalette } from '@/constants/home-tabs';
import { Layout } from '@/constants/layout';
import { LoginPalette } from '@/constants/login';
import { FontSize, Radius, Space, Spacing } from '@/constants/theme';

export const homeChatScreenStyles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingTop: HomeTabsLayout.contentTopPad,
    paddingBottom: HomeTabsLayout.contentBottomPad + Spacing.five,
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
  introDescription: {
    color: HomeTabsPalette.bodyText,
    fontSize: HomeTabsLayout.bodySize,
    lineHeight: HomeTabsLayout.lineHeight,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  pointText: {
    flex: 1,
    color: HomeTabsPalette.bodyText,
    fontSize: HomeTabsLayout.bodySize,
    lineHeight: HomeTabsLayout.lineHeight,
  },
  formCard: {
    backgroundColor: HomeTabsPalette.surface,
    borderRadius: HomeTabsLayout.infoCardRadius,
    borderWidth: 1,
    borderColor: HomeTabsPalette.cardBorder,
    padding: HomeTabsLayout.infoCardPad,
    gap: Spacing.two,
  },
  fieldBlock: {
    gap: Spacing.one,
  },
  fieldLabel: {
    color: HomeTabsPalette.inactiveText,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  fieldInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: LoginPalette.inputBorder,
    backgroundColor: LoginPalette.inputFill,
    borderRadius: Radius.small,
    paddingVertical: Space.small,
    paddingHorizontal: Space.medium,
    fontSize: FontSize.md,
    color: LoginPalette.bodyText,
    minHeight: Layout.inputMinHeight,
  },
  fieldInputMultiline: {
    minHeight: Spacing.five * 3,
    textAlignVertical: 'top',
  },
  formButtonWrap: {
    marginTop: Spacing.one,
  },
});
