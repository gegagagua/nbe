import Logo from "@/assets/images/logo.png";
import { LoginCopy } from "@/constants/login-copy";
import { Text, View } from "react-native";

import { Image } from "expo-image";
import { loginBrandHeaderStyles } from "./login-brand-header.styles";

export function LoginBrandHeader() {
  return (
    <View style={loginBrandHeaderStyles.container}>
      <Image source={Logo} style={{ width: 50, height: 50 }} />
      <View>
        <Text style={loginBrandHeaderStyles.brandEn} numberOfLines={3}>
          {LoginCopy.brandGeo}
        </Text>
        <View style={loginBrandHeaderStyles.brandDivider} />
        <Text style={loginBrandHeaderStyles.brandGeo} numberOfLines={2}>
          {LoginCopy.brandEn}
        </Text>
      </View>
    </View>
  );
}
