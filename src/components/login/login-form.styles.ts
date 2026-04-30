import { StyleSheet } from "react-native";

import { Layout } from "@/constants/layout";
import { LoginElevation, LoginPalette } from "@/constants/login";
import { Radius, Space, Typography } from "@/constants/theme";

export const loginFormStyles = StyleSheet.create({
  stack: {
    width: '100%',
    maxWidth: Layout.cardMaxWidth,
    alignSelf: 'center',
  },
  brandDivider: {
    height: 1,
    alignSelf: 'stretch',
    backgroundColor: LoginPalette.logoRed,
    marginBottom: Space.medium,
  },
  card: {
    width: '100%',
    backgroundColor: LoginPalette.cardBackground,
    borderRadius: Radius.medium,
    padding: Space.large,
    shadowColor: LoginPalette.primary,
    shadowOffset: { width: 0, height: LoginElevation.cardShadowOffsetY },
    shadowOpacity: LoginElevation.cardShadowOpacity,
    shadowRadius: LoginElevation.cardShadowRadius,
    elevation: LoginElevation.cardAndroidElevation,
  },
  fields: {
    gap: Space.medium,
    marginBottom: Space.medium,
  },
  fieldRow: {
    gap: Space.extraSmall,
  },
  fieldError: {
    color: LoginPalette.errorText,
    fontSize: Typography.small,
  },
  registerLink: {
    alignItems: "center",
    paddingTop: Space.extraSmall,
  },
  registerLinkText: {
    color: LoginPalette.placeholderMuted,
    fontSize: Typography.small,
    marginTop: Space.extraSmall,
  },
  guestLink: {
    alignItems: "center",
    paddingTop: Space.medium,
  },
  guestLinkText: {
    color: LoginPalette.placeholderMuted,
    fontSize: Typography.small,
    textDecorationLine: "underline",
  },
});
