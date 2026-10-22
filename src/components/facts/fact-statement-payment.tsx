import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

import { debtorExtractPaymentStyles as ps } from "@/components/debtor-registry/debtor-extract-payment.styles";
import { debtorExtractRequestStyles as s } from "@/components/debtor-registry/debtor-extract-request.styles";
import { PaymentMethodBrandIcon } from "@/components/debtor-registry/payment-method-brand-icon";
import { Button } from "@/components/ui/button";
import { DebtorRegistryPalette } from "@/constants/debtor-registry";
import { getFactStatementPaymentOptions } from "@/constants/fact-statement";
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
  const methods = useMemo(() => getFactStatementPaymentOptions(), []);

  return (
    <>
      <View style={ps.feeCard}>
        <Text style={ps.feeLabel}>{t("facts.stFeeTitle")}</Text>
        <Text style={ps.feeAmount}>
          {t("facts.stAmountValue", { amount: amount.toFixed(2) })}
        </Text>
      </View>
      <Text style={ps.methodsTitle}>{t("facts.stMethodsTitle")}</Text>
      <View style={[s.fieldGap, ps.methodsList]}>
        {methods.map((m) => {
          const isOn = selected === m.id;
          return (
            <Pressable
              key={m.id}
              accessibilityRole="radio"
              accessibilityState={{ selected: isOn }}
              onPress={() => onSelect(m.id)}
              style={[
                ps.methodPress,
                isOn && ps.methodPressSelected,
                m.id === "applePay" && ps.methodAccentApplePay,
              ]}
            >
              <PaymentMethodBrandIcon
                methodId={m.id === "applePay" ? "applePay" : "bankTransfer"}
                fallbackIcon={
                  m.icon as keyof typeof MaterialCommunityIcons.glyphMap
                }
              />
              <Text style={ps.methodLabel} numberOfLines={2}>
                {t(m.labelKey)}
              </Text>
              {isOn ? (
                <MaterialCommunityIcons
                  name="check-circle"
                  size={24}
                  color={DebtorRegistryPalette.buttonBg}
                />
              ) : (
                <View style={ps.methodRadioOuter} />
              )}
            </Pressable>
          );
        })}
      </View>
      <View style={s.primaryButtonWrap}>
        <Button label={t("facts.stPayButton")} onPress={onPay} />
      </View>
    </>
  );
}
