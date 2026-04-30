import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LoginCopy } from "@/constants/login-copy";
import { Space } from "@/constants/theme";
import { loginFooterStyles } from "./login-footer.styles";

export function LoginFooter() {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, Space.small);

  return (
    <View style={[loginFooterStyles.bar, { paddingBottom: bottomPad }]}>
      <Text style={loginFooterStyles.left}>{LoginCopy.footerLeft}</Text>
    </View>
  );
}
