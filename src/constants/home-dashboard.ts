import { LoginPalette } from "@/constants/login";
import { Space, Spacing } from "@/constants/theme";

export const HomeDashboardPalette = {
  headerBg: LoginPalette.primary,
  headerText: LoginPalette.onPrimary,
  pageBg: "#eef2f7",
  cardBg: "#ffffff",
  cardBorder: "#e6ebf2",
  /** Icon badges: shades of brand blue for a cohesive dashboard. */
  tabRed: "#1f3554",
  tabSlate: LoginPalette.primary,
  tabLight: "#4a6490",
  titleText: LoginPalette.primary,
  fabBorder: "#d0d7e2",
  notifBadgeBg: "#f10b0b",
  notifBadgeText: "#ffffff",
} as const;

export const HomeDashboardAssets = {
  headerLogoUri:
    "https://nbe-eps-webapp.staging.cloud.gov.ge/assets/logos/nbe_logo.svg",
} as const;

export const HomeDashboardLayoutConst = {
  cardRadius: 18,
  tabWidth: 52,
  tabHeight: 40,
  /** Half tab height — badge sits on the top edge of the card. */
  tabAnchorOffset: 17,
  /** ნავ-ბარათის ფიქსირებული სიმაღლე (აიქონის ზონის ქვემოთ კონტენტი იცენტრება). */
  cardHeight: 120,
  /** სათაურის ზონა აიქონის ქვემოთ (tabAnchor + tab). */
  cardBodyTopInset: 58,
  gridGap: Space.large,
  headerPaddingV: Space.medium,
  headerIconGap: Space.small,
  headerLogoWidth: 148,
  headerLogoHeight: 40,
  headerIconSize: 22,
  headerProfileIconSize: 28,
  notificationBadgeMinWidth: 43,
  notificationBadgeHeight: 35,
  notificationBadgeRadius: 11,
  notificationBadgePadH: Spacing.one + Spacing.half,
  notificationBadgeLineHeight: 22,
  navCardIconSize: 22,
  tabInnerRadius: 12,
  cardShadowOpacity: 0.1,
  cardShadowRadius: 18,
  cardShadowOffsetY: 8,
  cardElevation: 5,
  cardPressedOpacity: 0.94,
  navCardDisabledOpacity: 0.52,
  fabSize: 44,
  fabRadius: 8,
  fabBottomOffset: Spacing.six + Spacing.five + Spacing.three,
  fabShadowOpacity: 0.08,
} as const;
