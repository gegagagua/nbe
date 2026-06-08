import { StyleSheet } from "react-native";

import { Layout } from "@/constants/layout";
import { LoginPalette } from "@/constants/login";
import { Radius, Space, Typography } from "@/constants/theme";

export const inputStyles = StyleSheet.create({
  wrap: {
    position: 'relative',
    width: '100%',
  },
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
  inputWithEye: {
    paddingRight: 44,
  },
  inputError: {
    borderColor: LoginPalette.errorText,
  },
  eyeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
