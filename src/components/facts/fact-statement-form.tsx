import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, TextInput, View } from "react-native";

import { debtorExtractRequestStyles as s } from "@/components/debtor-registry/debtor-extract-request.styles";
import { Button } from "@/components/ui/button";
import { DatePickerField } from "@/components/ui/date-picker-field";
import { SelectField, type SelectOption } from "@/components/ui/select-field";
import { DebtorRegistryPalette } from "@/constants/debtor-registry";
import { FactStatementHourOptions } from "@/constants/fact-statement";
import { LoginPalette } from "@/constants/login";
import { parseOptionList } from "@/lib/fact-statement-helpers";
import type {
  FactFeeKind,
  FactOwnerKind,
  FactStatementForm as FactStatementFormState,
} from "@/types/fact-statement";

import { factStatementStyles as fs } from "./fact-statement.styles";

type Props = {
  form: FactStatementFormState;
  onChange: <K extends keyof FactStatementFormState>(
    key: K,
    value: FactStatementFormState[K],
  ) => void;
  error: string | null;
  onContinue: () => void;
  /**
   * When editing an already-recorded statement, the applicant segment is
   * read-only — everything else stays editable (per spec: on a recorded
   * application all data is editable except the applicant's data).
   */
  lockApplicant?: boolean;
};

/** "ლეიბლი *" — appends a red asterisk for required fields. */
function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <Text style={s.fieldLabel}>
      {label}
      {required ? <Text style={s.requiredMark}> *</Text> : null}
    </Text>
  );
}

export function FactStatementForm({
  form,
  onChange,
  error,
  onContinue,
  lockApplicant = false,
}: Props) {
  const { t } = useTranslation();

  const bureauOptions = useMemo(
    () => parseOptionList(t("facts.stBureauOptions")),
    [t],
  );
  const propertyTypeOptions = useMemo(
    () => parseOptionList(t("facts.stPropertyTypeOptions")),
    [t],
  );
  const hourOptions = useMemo<SelectOption[]>(
    () => FactStatementHourOptions.map((h) => ({ value: h, label: h })),
    [],
  );
  const ownerOptions = useMemo<SelectOption[]>(
    () => [
      { value: "none", label: t("facts.stOwnerTypeNone") },
      { value: "physical", label: t("facts.stOwnerTypePhysical") },
      { value: "legal", label: t("facts.stOwnerTypeLegal") },
    ],
    [t],
  );

  const feeOptions: { id: FactFeeKind; label: string }[] = [
    { id: "working", label: t("facts.stFeeWorking") },
    { id: "nonworking", label: t("facts.stFeeNonworking") },
  ];

  const closeA11y = t("facts.pickerClose");

  return (
    <>
      {/* ორგანიზაცია */}
      <View style={s.sectionCard}>
        <FieldLabel label={t("facts.stOrganizationLabel")} required />
        <SelectField
          value={form.organization}
          onChange={(v) => onChange("organization", v)}
          options={bureauOptions}
          placeholder={t("facts.stSelectPlaceholder")}
          title={t("facts.stOrganizationLabel")}
          closeA11yLabel={closeA11y}
        />
      </View>

      {/* განმცხადებელი */}
      <View style={s.sectionCard}>
        <Text style={s.sectionTitle}>{t("facts.stApplicantSection")}</Text>
        <View style={s.fieldGap}>
          <FieldLabel label={t("facts.stFirstNameLabel")} required />
          <TextInput
            value={form.applicantFirstName}
            onChangeText={(v) => onChange("applicantFirstName", v)}
            editable={!lockApplicant}
            style={[s.input, lockApplicant && s.inputDisabled]}
            placeholderTextColor={LoginPalette.placeholderMuted}
            accessibilityLabel={t("facts.stFirstNameLabel")}
          />
        </View>
        <View style={s.fieldGap}>
          <FieldLabel label={t("facts.stLastNameLabel")} required />
          <TextInput
            value={form.applicantLastName}
            onChangeText={(v) => onChange("applicantLastName", v)}
            editable={!lockApplicant}
            style={[s.input, lockApplicant && s.inputDisabled]}
            placeholderTextColor={LoginPalette.placeholderMuted}
            accessibilityLabel={t("facts.stLastNameLabel")}
          />
        </View>
        <View style={s.fieldGap}>
          <FieldLabel label={t("facts.stPersonalIdLabel")} required />
          <TextInput
            value={form.applicantPersonalId}
            onChangeText={(v) => onChange("applicantPersonalId", v)}
            editable={!lockApplicant}
            keyboardType="number-pad"
            style={[s.input, lockApplicant && s.inputDisabled]}
            placeholderTextColor={LoginPalette.placeholderMuted}
            accessibilityLabel={t("facts.stPersonalIdLabel")}
          />
        </View>
        <View style={s.fieldGap}>
          <FieldLabel label={t("facts.stActualAddressLabel")} required />
          <TextInput
            value={form.applicantActualAddress}
            onChangeText={(v) => onChange("applicantActualAddress", v)}
            editable={!lockApplicant}
            style={[s.input, s.inputMultiline, lockApplicant && s.inputDisabled]}
            multiline
            placeholderTextColor={LoginPalette.placeholderMuted}
            accessibilityLabel={t("facts.stActualAddressLabel")}
          />
        </View>
        <View style={s.fieldGap}>
          <FieldLabel label={t("facts.stLegalAddressLabel")} />
          <TextInput
            value={form.applicantLegalAddress}
            onChangeText={(v) => onChange("applicantLegalAddress", v)}
            editable={!lockApplicant}
            style={[s.input, s.inputMultiline, lockApplicant && s.inputDisabled]}
            multiline
            placeholderTextColor={LoginPalette.placeholderMuted}
            accessibilityLabel={t("facts.stLegalAddressLabel")}
          />
        </View>
        <View style={s.fieldGap}>
          <FieldLabel label={t("facts.stPhoneLabel")} required />
          <TextInput
            value={form.applicantPhone}
            onChangeText={(v) => onChange("applicantPhone", v)}
            editable={!lockApplicant}
            keyboardType="phone-pad"
            style={[s.input, lockApplicant && s.inputDisabled]}
            placeholderTextColor={LoginPalette.placeholderMuted}
            accessibilityLabel={t("facts.stPhoneLabel")}
          />
        </View>
        <View style={s.fieldGap}>
          <FieldLabel label={t("facts.stEmailLabel")} />
          <TextInput
            value={form.applicantEmail}
            onChangeText={(v) => onChange("applicantEmail", v)}
            editable={!lockApplicant}
            keyboardType="email-address"
            autoCapitalize="none"
            style={[s.input, lockApplicant && s.inputDisabled]}
            placeholderTextColor={LoginPalette.placeholderMuted}
            accessibilityLabel={t("facts.stEmailLabel")}
          />
        </View>
      </View>

      {/* საფასური */}
      <View style={s.sectionCard}>
        <Text style={s.sectionTitle}>{t("facts.stFeeSection")}</Text>
        <View style={fs.radioList}>
          {feeOptions.map((opt) => {
            const isOn = form.fee === opt.id;
            return (
              <Pressable
                key={opt.id}
                style={[fs.radioRow, isOn && fs.radioRowSelected]}
                onPress={() => onChange("fee", opt.id)}
                accessibilityRole="radio"
                accessibilityState={{ selected: isOn }}
              >
                <MaterialCommunityIcons
                  name={isOn ? "radiobox-marked" : "radiobox-blank"}
                  size={22}
                  color={
                    isOn
                      ? LoginPalette.logoRed
                      : DebtorRegistryPalette.inputBorder
                  }
                />
                <Text style={fs.radioLabel}>{opt.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* ფაქტის დადგენის თარიღი */}
      <View style={s.sectionCard}>
        <Text style={s.sectionTitle}>{t("facts.stFactDateSection")}</Text>
        <View style={s.fieldGap}>
          <FieldLabel label={t("facts.stDateFrom")} required />
          <DatePickerField
            value={form.factDateFrom}
            onChange={(v) => onChange("factDateFrom", v)}
            placeholder={t("facts.datePlaceholder")}
            weekdays={t("facts.pickerWeekdays").split(",")}
            months={t("facts.pickerMonths").split(",")}
            clearLabel={t("facts.pickerClear")}
            closeLabel={t("facts.pickerClose")}
          />
        </View>
        <View style={s.fieldGap}>
          <FieldLabel label={t("facts.stDateTo")} required />
          <DatePickerField
            value={form.factDateTo}
            onChange={(v) => onChange("factDateTo", v)}
            placeholder={t("facts.datePlaceholder")}
            weekdays={t("facts.pickerWeekdays").split(",")}
            months={t("facts.pickerMonths").split(",")}
            clearLabel={t("facts.pickerClear")}
            closeLabel={t("facts.pickerClose")}
          />
        </View>
        <FieldLabel label={t("facts.stTimeLabel")} required />
        <View style={fs.timeRow}>
          <View style={fs.timeCol}>
            <Text style={s.fieldLabel}>{t("facts.stTimeFrom")}</Text>
            <SelectField
              value={form.factHourFrom}
              onChange={(v) => onChange("factHourFrom", v)}
              options={hourOptions}
              placeholder="--:--"
              title={t("facts.stTimeFrom")}
              closeA11yLabel={closeA11y}
            />
          </View>
          <View style={fs.timeCol}>
            <Text style={s.fieldLabel}>{t("facts.stTimeTo")}</Text>
            <SelectField
              value={form.factHourTo}
              onChange={(v) => onChange("factHourTo", v)}
              options={hourOptions}
              placeholder="--:--"
              title={t("facts.stTimeTo")}
              closeA11yLabel={closeA11y}
            />
          </View>
        </View>
        <Pressable
          style={fs.timeClear}
          onPress={() => {
            onChange("factHourFrom", "");
            onChange("factHourTo", "");
          }}
          accessibilityRole="button"
        >
          <Text style={fs.timeClearText}>{t("facts.stTimeClear")}</Text>
        </Pressable>
      </View>

      {/* ფაქტების დადგენის ადგილი */}
      <View style={s.sectionCard}>
        <Text style={s.sectionTitle}>{t("facts.stPlaceSection")}</Text>
        <View style={s.fieldGap}>
          <FieldLabel label={t("facts.stPropertyTypeLabel")} required />
          <SelectField
            value={form.propertyType}
            onChange={(v) => onChange("propertyType", v)}
            options={propertyTypeOptions}
            placeholder={t("facts.stSelectPlaceholder")}
            title={t("facts.stPropertyTypeLabel")}
            closeA11yLabel={closeA11y}
          />
        </View>
        <View style={s.fieldGap}>
          <FieldLabel label={t("facts.stCadCodeLabel")} />
          <TextInput
            value={form.cadCode}
            onChangeText={(v) => onChange("cadCode", v)}
            style={s.input}
            placeholderTextColor={LoginPalette.placeholderMuted}
            accessibilityLabel={t("facts.stCadCodeLabel")}
          />
        </View>
        <View style={s.fieldGap}>
          <FieldLabel label={t("facts.stPlaceAddressLabel")} required />
          <TextInput
            value={form.placeAddress}
            onChangeText={(v) => onChange("placeAddress", v)}
            style={[s.input, s.inputMultiline]}
            multiline
            placeholderTextColor={LoginPalette.placeholderMuted}
            accessibilityLabel={t("facts.stPlaceAddressLabel")}
          />
        </View>
      </View>

      {/* მესაკუთრე */}
      <View style={s.sectionCard}>
        <Text style={s.sectionTitle}>{t("facts.stOwnerSection")}</Text>
        <View style={s.fieldGap}>
          <FieldLabel label={t("facts.stOwnerTypeLabel")} />
          <SelectField
            value={form.ownerKind}
            onChange={(v) => onChange("ownerKind", v as FactOwnerKind)}
            options={ownerOptions}
            placeholder={t("facts.stSelectPlaceholder")}
            title={t("facts.stOwnerTypeLabel")}
            closeA11yLabel={closeA11y}
          />
        </View>
        {form.ownerKind === "physical" ? (
          <>
            <View style={s.fieldGap}>
              <FieldLabel label={t("facts.stPersonalIdLabel")} required />
              <TextInput
                value={form.ownerPersonalId}
                onChangeText={(v) => onChange("ownerPersonalId", v)}
                keyboardType="number-pad"
                style={s.input}
                placeholderTextColor={LoginPalette.placeholderMuted}
                accessibilityLabel={t("facts.stPersonalIdLabel")}
              />
            </View>
            <View style={s.fieldGap}>
              <FieldLabel label={t("facts.stFirstNameLabel")} required />
              <TextInput
                value={form.ownerFirstName}
                onChangeText={(v) => onChange("ownerFirstName", v)}
                style={s.input}
                placeholderTextColor={LoginPalette.placeholderMuted}
                accessibilityLabel={t("facts.stFirstNameLabel")}
              />
            </View>
            <View style={s.fieldGap}>
              <FieldLabel label={t("facts.stLastNameLabel")} required />
              <TextInput
                value={form.ownerLastName}
                onChangeText={(v) => onChange("ownerLastName", v)}
                style={s.input}
                placeholderTextColor={LoginPalette.placeholderMuted}
                accessibilityLabel={t("facts.stLastNameLabel")}
              />
            </View>
            <View style={s.fieldGap}>
              <FieldLabel label={t("facts.stOwnerAddressLabel")} required />
              <TextInput
                value={form.ownerAddress}
                onChangeText={(v) => onChange("ownerAddress", v)}
                style={[s.input, s.inputMultiline]}
                multiline
                placeholderTextColor={LoginPalette.placeholderMuted}
                accessibilityLabel={t("facts.stOwnerAddressLabel")}
              />
            </View>
          </>
        ) : null}
        {form.ownerKind === "legal" ? (
          <>
            <View style={s.fieldGap}>
              <FieldLabel label={t("facts.stOwnerLegalCodeLabel")} required />
              <TextInput
                value={form.ownerLegalCode}
                onChangeText={(v) => onChange("ownerLegalCode", v)}
                keyboardType="number-pad"
                style={s.input}
                placeholderTextColor={LoginPalette.placeholderMuted}
                accessibilityLabel={t("facts.stOwnerLegalCodeLabel")}
              />
            </View>
            <View style={s.fieldGap}>
              <FieldLabel label={t("facts.stOwnerLegalNameLabel")} required />
              <TextInput
                value={form.ownerLegalName}
                onChangeText={(v) => onChange("ownerLegalName", v)}
                style={s.input}
                placeholderTextColor={LoginPalette.placeholderMuted}
                accessibilityLabel={t("facts.stOwnerLegalNameLabel")}
              />
            </View>
            <View style={s.fieldGap}>
              <FieldLabel label={t("facts.stOwnerAddressLabel")} required />
              <TextInput
                value={form.ownerAddress}
                onChangeText={(v) => onChange("ownerAddress", v)}
                style={[s.input, s.inputMultiline]}
                multiline
                placeholderTextColor={LoginPalette.placeholderMuted}
                accessibilityLabel={t("facts.stOwnerAddressLabel")}
              />
            </View>
          </>
        ) : null}
      </View>

      {/* მოთხოვნა */}
      <View style={s.sectionCard}>
        <FieldLabel label={t("facts.stRequestLabel")} required />
        <TextInput
          value={form.request}
          onChangeText={(v) => onChange("request", v)}
          style={[s.input, s.inputMultiline]}
          multiline
          placeholderTextColor={LoginPalette.placeholderMuted}
          accessibilityLabel={t("facts.stRequestLabel")}
        />
      </View>

      {error ? <Text style={s.errorText}>{error}</Text> : null}
      <Text style={s.hintText}>{t("facts.stRequiredHint")}</Text>
      <View style={s.primaryButtonWrap}>
        <Button label={t("facts.stRecordButton")} onPress={onContinue} />
      </View>
    </>
  );
}
