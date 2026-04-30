import { Text, View } from "react-native";
import { SvgXml } from "react-native-svg";

import { LoginCopy } from "@/constants/login-copy";
import { logoSvg } from "@/constants/logo-svg";

import { loginBrandHeaderStyles } from "./login-brand-header.styles";

export function LoginBrandHeader() {
  return (
    <View style={loginBrandHeaderStyles.container}>
      <SvgXml xml={logoSvg} width={146} height={47} />
      <Text style={loginBrandHeaderStyles.title}>{LoginCopy.brandGeo}</Text>
    </View>
  );
}
