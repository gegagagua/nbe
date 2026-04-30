import { StyleSheet } from "react-native";

import { Layout } from "@/constants/layout";
import { LoginPalette } from "@/constants/login";
import { Radius, Space, Typography } from "@/constants/theme";

export const inputStyles = StyleSheet.create({
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: LoginPalette.inputBorder,
    backgroundColor: LoginPalette.inputFill,
    borderRadius: Radius.small,
    paddingVertical: Space.small,
    paddingHorizontal: Space.medium,
    fontSize: Typography.medium,
    color: LoginPalette.bodyText,
    minHeight: Layout.inputMinHeight,
  },
  inputError: {
    borderColor: LoginPalette.errorText,
  },
});
