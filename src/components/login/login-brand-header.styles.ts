import { Platform, StyleSheet } from "react-native";

import { LetterSpacing } from "@/constants/letter-spacing";
import { LoginPalette } from "@/constants/login";
import { Space, Typography } from "@/constants/theme";

export const loginBrandHeaderStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: Space.extraLarge,
    flexDirection: "row",
    justifyContent: "center",
    gap: Space.medium,
  },
  brandEn: {
    fontSize: Typography.small,
    fontWeight: "700",
    color: LoginPalette.titleText,

    letterSpacing: LetterSpacing.headerLogoEn,
    textTransform: "uppercase",
  },
  brandGeo: {
    fontSize: Typography.small,
    fontWeight: "700",
    color: LoginPalette.titleText,

    letterSpacing: Platform.select({
      ios: LetterSpacing.brandTitleIos,
      default: LetterSpacing.none,
    }),
  },
  brandDivider: {
    height: 1,
    alignSelf: "stretch",
    backgroundColor: LoginPalette.logoRed,
    marginVertical: Space.extraSmall,
  },
});
