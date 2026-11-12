import { useTranslation } from "react-i18next";
import { ActivityIndicator, Text, View } from "react-native";

import { useAppTheme } from "@/theme";

type Props = {
  visible: boolean;
};

export function PaymentSettlingOverlay({ visible }: Props) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();

  if (!visible) return null;

  return (
    <View
      className="absolute inset-0 z-10 items-center justify-center gap-4 bg-bg px-8"
      accessibilityRole="progressbar"
      accessibilityLabel={t("debtors.paySettling")}
      accessibilityLiveRegion="polite"
    >
      <ActivityIndicator size="large" color={colors.primary} />
      <Text className="text-center text-body-lg text-fg">
        {t("debtors.paySettling")}
      </Text>
    </View>
  );
}
