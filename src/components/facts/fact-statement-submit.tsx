import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import Toast from "react-native-toast-message";

import { Button, Card } from "@/components/ui";
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
  /** Date shown next to the registration number (Confluence parity). */
  registeredDate?: string | null;
  paymentMethod: FactStatementPaymentMethod;
  onSent: () => void;
};

export function FactStatementSubmit({
  referenceNumber,
  registeredDate,
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
      <Card className="gap-3">
        <View className="flex-row items-center justify-between gap-2">
          <Text className="text-label text-fg-muted">
            {t("facts.stPaymentStatusLabel")}
          </Text>
          <Text className="text-body font-semibold text-fg">
            {t("facts.stPaymentStatusPaid")}
          </Text>
        </View>
        <View className="flex-row items-center justify-between gap-2">
          <Text className="text-label text-fg-muted">
            {t("facts.stRefNumberLabel")}
          </Text>
          <Text className="text-body font-semibold text-fg">
            {referenceNumber}
          </Text>
        </View>
        {registeredDate ? (
          <View className="flex-row items-center justify-between gap-2">
            <Text className="text-label text-fg-muted">
              {t("facts.stRegDateLabel")}
            </Text>
            <Text className="text-body font-semibold text-fg">
              {registeredDate}
            </Text>
          </View>
        ) : null}
        <View className="flex-row items-center justify-between gap-2">
          <Text className="text-label text-fg-muted">
            {t("facts.stMethodsTitle")}
          </Text>
          <Text className="text-body font-semibold text-fg">
            {t(METHOD_LABEL[paymentMethod])}
          </Text>
        </View>
      </Card>
      <Text className="text-caption text-fg-muted">
        {t("facts.stSubmitHint")}
      </Text>
      <Button label={t("facts.stSubmitButton")} onPress={onSubmit} />
    </>
  );
}
