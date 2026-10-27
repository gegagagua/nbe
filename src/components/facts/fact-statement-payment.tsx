import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { PaymentMethodBrandIcon } from "@/components/debtor-registry/payment-method-brand-icon";
import { Button, Card, PressableScale } from "@/components/ui";
import { getFactStatementPaymentOptions } from "@/constants/fact-statement";
import { useAppTheme } from "@/theme";
import type { FactStatementPaymentMethod } from "@/types/fact-statement";

type Props = {
  selected: FactStatementPaymentMethod;
  onSelect: (m: FactStatementPaymentMethod) => void;
  onPay: () => void;
  /** Payable amount in GEL (200 working / 300 non-working). */
  amount: number;
};

export function FactStatementPayment({
  selected,
  onSelect,
  onPay,
  amount,
}: Props) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const methods = useMemo(() => getFactStatementPaymentOptions(), []);

  return (
    <>
      <Card className="items-center gap-1 bg-surface-sunken">
        <Text className="text-label text-fg-muted">{t("facts.stFeeTitle")}</Text>
        <Text className="text-title font-bold text-fg">
          {t("facts.stAmountValue", { amount: amount.toFixed(2) })}
        </Text>
      </Card>
      <Text className="text-subtitle font-bold text-fg">
        {t("facts.stMethodsTitle")}
      </Text>
      <View className="gap-2">
        {methods.map((m) => {
          const isOn = selected === m.id;
          return (
            <PressableScale
              key={m.id}
              accessibilityRole="radio"
              accessibilityState={{ selected: isOn }}
              onPress={() => onSelect(m.id)}
              className={`flex-row items-center gap-3 rounded-md border bg-input px-4 py-3 ${isOn ? "border-fg bg-surface-sunken" : "border-border"}`}
            >
              <PaymentMethodBrandIcon
                methodId={m.id === "applePay" ? "applePay" : "bankTransfer"}
                fallbackIcon={
                  m.icon as keyof typeof MaterialCommunityIcons.glyphMap
                }
              />
              <Text className="flex-1 text-body text-fg" numberOfLines={2}>
                {t(m.labelKey)}
              </Text>
              {isOn ? (
                <MaterialCommunityIcons
                  name="check-circle"
                  size={24}
                  color={colors.primary}
                />
              ) : (
                <View className="h-6 w-6 rounded-full border-2 border-border" />
              )}
            </PressableScale>
          );
        })}
      </View>
      <Button label={t("facts.stPayButton")} onPress={onPay} />
    </>
  );
}
