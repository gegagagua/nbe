import { StyleSheet } from "react-native";

import { HomeTabsLayout, HomeTabsPalette } from "@/constants/home-tabs";
import { Spacing } from "@/constants/theme";

export const homeFaqScreenStyles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: Spacing.five,
    gap: Spacing.two,
    marginTop: Spacing.three,
    paddingHorizontal: Spacing.two,
  },
  heading: {
    color: HomeTabsPalette.inactiveText,
    fontSize: HomeTabsLayout.titleSize,
    fontWeight: "700",
    marginBottom: Spacing.one,
  },
  card: {
    backgroundColor: HomeTabsPalette.faqQuestionBg,
    borderWidth: 1,
    borderColor: HomeTabsPalette.cardBorder,
    borderRadius: HomeTabsLayout.infoCardRadius,
    overflow: "hidden",
  },
  trigger: {
    paddingHorizontal: HomeTabsLayout.infoCardPad,
    paddingVertical: Spacing.two + Spacing.one,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  question: {
    flex: 1,
    color: HomeTabsPalette.inactiveText,
    fontSize: HomeTabsLayout.bodySize,
    lineHeight: HomeTabsLayout.lineHeight,
    fontWeight: "600",
  },
  answerWrap: {
    backgroundColor: HomeTabsPalette.faqAnswerBg,
    paddingHorizontal: HomeTabsLayout.infoCardPad,
    paddingBottom: HomeTabsLayout.infoCardPad,
    paddingTop: Spacing.one,
  },
  answer: {
    color: HomeTabsPalette.bodyText,
    fontSize: HomeTabsLayout.bodySize,
    lineHeight: HomeTabsLayout.lineHeight,
  },
});
