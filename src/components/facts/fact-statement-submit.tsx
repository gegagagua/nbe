import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import Toast from "react-native-toast-message";

import { debtorExtractPaymentStyles as ps } from "@/components/debtor-registry/debtor-extract-payment.styles";
import { debtorExtractRequestStyles as s } from "@/components/debtor-registry/debtor-extract-request.styles";
import { Button } from "@/components/ui/button";
import { ToastLayout } from "@/constants/toast";
import type {
  FactStatementPaymentMethod,
  FactStatementPaymentOptionLabelKey,
} from "@/types/fact-statement";

const METHOD_LABEL: Record<
  FactStatementPaymentMethod,
  FactStatementPaymentOptionLabelKey
> = {
  card: "facts.stMethodCard",
  bankTransfer: "facts.stMethodBankTransfer",
  applePay: "facts.stMethodApplePay",
  googlePay: "facts.stMethodGooglePay",
};

type Props = {
  referenceNumber: string;
  paymentMethod: FactStatementPaymentMethod;
  onSent: () => void;
};

export function FactStatementSubmit({
  referenceNumber,
  paymentMethod,
  onSent,
}: Props) {
  const { t } = useTranslation();
  const onSubmit = () => {
    Toast.show({
      type: "info",
      text1: t("facts.stSubmitToast"),
      visibilityTime: ToastLayout.visibilityMs,
      position: "top",
    });
    onSent();
  };
  return (
    <>
      <View style={ps.summaryCard}>
        <View style={ps.summaryRow}>
          <Text style={ps.summaryLabel}>{t("facts.stPaymentStatusLabel")}</Text>
          <Text style={ps.summaryValue}>{t("facts.stPaymentStatusPaid")}</Text>
        </View>
        <View style={ps.summaryRow}>
          <Text style={ps.summaryLabel}>{t("facts.stRefNumberLabel")}</Text>
          <Text style={ps.summaryValue}>{referenceNumber}</Text>
        </View>
        <View style={ps.summaryRow}>
          <Text style={ps.summaryLabel}>{t("facts.stMethodsTitle")}</Text>
          <Text style={ps.summaryValue}>{t(METHOD_LABEL[paymentMethod])}</Text>
        </View>
      </View>
      <Text style={s.hintText}>{t("facts.stSubmitHint")}</Text>
      <View style={s.primaryButtonWrap}>
        <Button label={t("facts.stSubmitButton")} onPress={onSubmit} />
      </View>
    </>
  );
}
