import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { isGuestMode } from "@/lib/guest-mode";

type Props = {
  applicantPersonalId: string;
  applicantFullName: string;
  onApplicantPersonalId?: (v: string) => void;
  onApplicantFullName?: (v: string) => void;
  subjectPersonalId: string;
  onSubjectPersonalId: (v: string) => void;
  subjectFullName: string;
  onSubjectFullName: (v: string) => void;
  onContinue: () => void;
};

export function DebtorExtractPhaseForm({
  applicantPersonalId,
  applicantFullName,
  onApplicantPersonalId,
  onApplicantFullName,
  subjectPersonalId,
  onSubjectPersonalId,
  subjectFullName,
  onSubjectFullName,
  onContinue,
}: Props) {
  const { t } = useTranslation();
  const isGuest = isGuestMode();
  return (
    <>
      <Card className="gap-4">
        <Text className="text-body font-bold text-fg">
          {t("debtors.extractApplicantSection")}
        </Text>
        <View className="gap-2">
          <Text className="text-label font-semibold text-fg-secondary">
            {t("debtors.extractApplicantPnLabel")}
          </Text>
          {isGuest && onApplicantPersonalId ? (
            <Input
              value={applicantPersonalId}
              onChangeText={onApplicantPersonalId}
              placeholder={t("debtors.searchApplicantPnPlaceholder")}
            />
          ) : (
            <Text className="text-body font-medium text-fg">{applicantPersonalId}</Text>
          )}
        </View>
        <View className="gap-2">
          <Text className="text-label font-semibold text-fg-secondary">
            {t("debtors.extractApplicantNameLabel")}
          </Text>
          {isGuest && onApplicantFullName ? (
            <Input
              value={applicantFullName}
              onChangeText={onApplicantFullName}
              placeholder={t("debtors.extractSubjectNamePlaceholder")}
            />
          ) : (
            <Text className="text-body font-medium text-fg">{applicantFullName}</Text>
          )}
        </View>
      </Card>
      <Card className="gap-4">
        <Text className="text-body font-bold text-fg">
          {t("debtors.extractSubjectSection")}
        </Text>
        <View className="gap-2">
          <Text className="text-label font-semibold text-fg-secondary">
            {t("debtors.extractSubjectIdLabel")}
          </Text>
          <Input
            value={subjectPersonalId}
            onChangeText={onSubjectPersonalId}
            placeholder={t("debtors.extractSubjectIdPlaceholder")}
          />
        </View>
        <View className="gap-2">
          <Text className="text-label font-semibold text-fg-secondary">
            {t("debtors.extractSubjectNameLabel")}
          </Text>
          <Input
            value={subjectFullName}
            onChangeText={onSubjectFullName}
            placeholder={t("debtors.extractSubjectNamePlaceholder")}
          />
        </View>
      </Card>
      <Button label={t("debtors.extractContinuePayment")} onPress={onContinue} />
    </>
  );
}
