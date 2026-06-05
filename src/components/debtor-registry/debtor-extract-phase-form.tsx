import { useTranslation } from "react-i18next";
import { Text, TextInput, View } from "react-native";

import { Button } from "@/components/ui/button";
import { LoginPalette } from "@/constants/login";
import { isGuestMode } from "@/lib/guest-mode";

import { debtorExtractRequestStyles as s } from "./debtor-extract-request.styles";

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
      <View style={s.sectionCard}>
        <Text style={s.sectionTitle}>
          {t("debtors.extractApplicantSection")}
        </Text>
        <View style={s.fieldGap}>
          <Text style={s.fieldLabel}>
            {t("debtors.extractApplicantPnLabel")}
          </Text>
          {isGuest && onApplicantPersonalId ? (
            <TextInput
              value={applicantPersonalId}
              onChangeText={onApplicantPersonalId}
              placeholder={t("debtors.searchApplicantPnPlaceholder")}
              placeholderTextColor={LoginPalette.placeholderMuted}
              style={s.input}
              accessibilityLabel={t("debtors.extractApplicantPnLabel")}
            />
          ) : (
            <Text style={s.readonlyValue}>{applicantPersonalId}</Text>
          )}
        </View>
        <View style={s.fieldGap}>
          <Text style={s.fieldLabel}>
            {t("debtors.extractApplicantNameLabel")}
          </Text>
          {isGuest && onApplicantFullName ? (
            <TextInput
              value={applicantFullName}
              onChangeText={onApplicantFullName}
              placeholder={t("debtors.extractSubjectNamePlaceholder")}
              placeholderTextColor={LoginPalette.placeholderMuted}
              style={[s.input, s.inputMultiline]}
              multiline
              accessibilityLabel={t("debtors.extractApplicantNameLabel")}
            />
          ) : (
            <Text style={s.readonlyValue}>{applicantFullName}</Text>
          )}
        </View>
      </View>
      <View style={s.sectionCard}>
        <Text style={s.sectionTitle}>{t("debtors.extractSubjectSection")}</Text>
        <View style={s.fieldGap}>
          <Text style={s.fieldLabel}>{t("debtors.extractSubjectIdLabel")}</Text>
          <TextInput
            value={subjectPersonalId}
            onChangeText={onSubjectPersonalId}
            placeholder={t("debtors.extractSubjectIdPlaceholder")}
            placeholderTextColor={LoginPalette.placeholderMuted}
            style={s.input}
            accessibilityLabel={t("debtors.extractSubjectIdLabel")}
          />
        </View>
        <View style={s.fieldGap}>
          <Text style={s.fieldLabel}>
            {t("debtors.extractSubjectNameLabel")}
          </Text>
          <TextInput
            value={subjectFullName}
            onChangeText={onSubjectFullName}
            placeholder={t("debtors.extractSubjectNamePlaceholder")}
            placeholderTextColor={LoginPalette.placeholderMuted}
            style={[s.input, s.inputMultiline]}
            multiline
            accessibilityLabel={t("debtors.extractSubjectNameLabel")}
          />
        </View>
      </View>
      <View style={s.primaryButtonWrap}>
        <Button
          label={t("debtors.extractContinuePayment")}
          onPress={onContinue}
        />
      </View>
    </>
  );
}
