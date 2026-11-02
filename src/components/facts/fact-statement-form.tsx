import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, TextInput, View } from "react-native";

import { Button, Card, PressableScale } from "@/components/ui";
import { DatePickerField } from "@/components/ui/date-picker-field";
import { SelectField, type SelectOption } from "@/components/ui/select-field";
import { FactStatementHourOptions } from "@/constants/fact-statement";
import { parseOptionList } from "@/lib/fact-statement-helpers";
import { useAppTheme } from "@/theme";
import type {
  FactFeeKind,
  FactOwnerKind,
  FactStatementForm as FactStatementFormState,
} from "@/types/fact-statement";

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
    <Text className="text-label font-semibold text-fg-secondary">
      {label}
      {required ? <Text className="text-danger"> *</Text> : null}
    </Text>
  );
}

const INPUT_CLASS =
  "rounded-md border border-input-border bg-input px-3 py-2 text-body text-fg min-h-[50px]";

export function FactStatementForm({
  form,
  onChange,
  error,
  onContinue,
  lockApplicant = false,
}: Props) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();

  const inputProps = {
    placeholderTextColor: colors.inputPlaceholder,
  };
  const disabledClass = (locked: boolean) =>
    locked ? "bg-surface-sunken text-fg-muted" : "";

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
      <Card className="gap-2">
        <FieldLabel label={t("facts.stOrganizationLabel")} required />
        <SelectField
          value={form.organization}
          onChange={(v) => onChange("organization", v)}
          options={bureauOptions}
          placeholder={t("facts.stSelectPlaceholder")}
          title={t("facts.stOrganizationLabel")}
          closeA11yLabel={closeA11y}
        />
      </Card>

      {/* განმცხადებელი */}
      <Card className="gap-3">
        <Text className="text-subtitle font-bold text-fg">
          {t("facts.stApplicantSection")}
        </Text>
        {form.applicantKind === "legal" ? (
          <>
            {/* იურიდიული პირი: დასახელება + საიდენტიფიკაციო კოდი */}
            <View className="gap-1">
              <FieldLabel label={t("facts.stOrgNameLabel")} required />
              <TextInput
                value={form.applicantOrgName}
                onChangeText={(v) => onChange("applicantOrgName", v)}
                editable={!lockApplicant}
                className={`${INPUT_CLASS} ${disabledClass(lockApplicant)}`}
                accessibilityLabel={t("facts.stOrgNameLabel")}
                {...inputProps}
              />
            </View>
            <View className="gap-1">
              <FieldLabel label={t("facts.stIdCodeLabel")} required />
              <TextInput
                value={form.applicantPersonalId}
                onChangeText={(v) => onChange("applicantPersonalId", v)}
                editable={!lockApplicant}
                keyboardType="number-pad"
                className={`${INPUT_CLASS} ${disabledClass(lockApplicant)}`}
                accessibilityLabel={t("facts.stIdCodeLabel")}
                {...inputProps}
              />
            </View>
          </>
        ) : (
          <>
            {/* ფიზიკური პირი: სახელი + გვარი + პირადი ნომერი */}
            <View className="gap-1">
              <FieldLabel label={t("facts.stFirstNameLabel")} required />
              <TextInput
                value={form.applicantFirstName}
                onChangeText={(v) => onChange("applicantFirstName", v)}
                editable={!lockApplicant}
                className={`${INPUT_CLASS} ${disabledClass(lockApplicant)}`}
                accessibilityLabel={t("facts.stFirstNameLabel")}
                {...inputProps}
              />
            </View>
            <View className="gap-1">
              <FieldLabel label={t("facts.stLastNameLabel")} required />
              <TextInput
                value={form.applicantLastName}
                onChangeText={(v) => onChange("applicantLastName", v)}
                editable={!lockApplicant}
                className={`${INPUT_CLASS} ${disabledClass(lockApplicant)}`}
                accessibilityLabel={t("facts.stLastNameLabel")}
                {...inputProps}
              />
            </View>
            <View className="gap-1">
              <FieldLabel label={t("facts.stPersonalIdLabel")} required />
              <TextInput
                value={form.applicantPersonalId}
                onChangeText={(v) => onChange("applicantPersonalId", v)}
                editable={!lockApplicant}
                keyboardType="number-pad"
                className={`${INPUT_CLASS} ${disabledClass(lockApplicant)}`}
                accessibilityLabel={t("facts.stPersonalIdLabel")}
                {...inputProps}
              />
            </View>
          </>
        )}
        <View className="gap-1">
          <FieldLabel label={t("facts.stActualAddressLabel")} required />
          <TextInput
            value={form.applicantActualAddress}
            onChangeText={(v) => onChange("applicantActualAddress", v)}
            editable={!lockApplicant}
            className={`${INPUT_CLASS} min-h-[80px] ${disabledClass(lockApplicant)}`}
            multiline
            accessibilityLabel={t("facts.stActualAddressLabel")}
            {...inputProps}
          />
        </View>
        <View className="gap-1">
          <FieldLabel label={t("facts.stLegalAddressLabel")} />
          <TextInput
            value={form.applicantLegalAddress}
            onChangeText={(v) => onChange("applicantLegalAddress", v)}
            editable={!lockApplicant}
            className={`${INPUT_CLASS} min-h-[80px] ${disabledClass(lockApplicant)}`}
            multiline
            accessibilityLabel={t("facts.stLegalAddressLabel")}
            {...inputProps}
          />
        </View>
        <View className="gap-1">
          <FieldLabel label={t("facts.stPhoneLabel")} required />
          <TextInput
            value={form.applicantPhone}
            onChangeText={(v) => onChange("applicantPhone", v)}
            editable={!lockApplicant}
            keyboardType="phone-pad"
            className={`${INPUT_CLASS} ${disabledClass(lockApplicant)}`}
            accessibilityLabel={t("facts.stPhoneLabel")}
            {...inputProps}
          />
        </View>
        <View className="gap-1">
          <FieldLabel label={t("facts.stEmailLabel")} />
          <TextInput
            value={form.applicantEmail}
            onChangeText={(v) => onChange("applicantEmail", v)}
            editable={!lockApplicant}
            keyboardType="email-address"
            autoCapitalize="none"
            className={`${INPUT_CLASS} ${disabledClass(lockApplicant)}`}
            accessibilityLabel={t("facts.stEmailLabel")}
            {...inputProps}
          />
        </View>
      </Card>

      {/* საფასური */}
      <Card className="gap-3">
        <Text className="text-subtitle font-bold text-fg">
          {t("facts.stFeeSection")}
        </Text>
        <View className="gap-2">
          {feeOptions.map((opt) => {
            const isOn = form.fee === opt.id;
            return (
              <PressableScale
                key={opt.id}
                className={`flex-row items-center gap-2 rounded-md border bg-input px-4 py-2 ${isOn ? "border-fg bg-surface-sunken" : "border-border"}`}
                onPress={() => onChange("fee", opt.id)}
                accessibilityRole="radio"
                accessibilityState={{ selected: isOn }}
              >
                <MaterialCommunityIcons
                  name={isOn ? "radiobox-marked" : "radiobox-blank"}
                  size={22}
                  color={isOn ? colors.danger : colors.inputBorder}
                />
                <Text className="flex-1 text-body text-fg">{opt.label}</Text>
              </PressableScale>
            );
          })}
        </View>
      </Card>

      {/* ფაქტის დადგენის თარიღი */}
      <Card className="gap-3">
        <Text className="text-subtitle font-bold text-fg">
          {t("facts.stFactDateSection")}
        </Text>
        <View className="gap-1">
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
        <View className="gap-1">
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
        <View className="flex-row items-end gap-2">
          <View className="flex-1 gap-1">
            <Text className="text-label font-semibold text-fg-secondary">
              {t("facts.stTimeFrom")}
            </Text>
            <SelectField
              value={form.factHourFrom}
              onChange={(v) => onChange("factHourFrom", v)}
              options={hourOptions}
              placeholder="--:--"
              title={t("facts.stTimeFrom")}
              closeA11yLabel={closeA11y}
            />
          </View>
          <View className="flex-1 gap-1">
            <Text className="text-label font-semibold text-fg-secondary">
              {t("facts.stTimeTo")}
            </Text>
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
          className="self-start px-4 py-2"
          onPress={() => {
            onChange("factHourFrom", "");
            onChange("factHourTo", "");
          }}
          accessibilityRole="button"
        >
          <Text className="text-label font-bold text-fg">
            {t("facts.stTimeClear")}
          </Text>
        </Pressable>
      </Card>

      {/* ფაქტების დადგენის ადგილი */}
      <Card className="gap-3">
        <Text className="text-subtitle font-bold text-fg">
          {t("facts.stPlaceSection")}
        </Text>
        <View className="gap-1">
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
        <View className="gap-1">
          <FieldLabel label={t("facts.stCadCodeLabel")} />
          <TextInput
            value={form.cadCode}
            onChangeText={(v) => onChange("cadCode", v)}
            className={INPUT_CLASS}
            accessibilityLabel={t("facts.stCadCodeLabel")}
            {...inputProps}
          />
        </View>
        <View className="gap-1">
          <FieldLabel label={t("facts.stPlaceAddressLabel")} required />
          <TextInput
            value={form.placeAddress}
            onChangeText={(v) => onChange("placeAddress", v)}
            className={`${INPUT_CLASS} min-h-[80px]`}
            multiline
            accessibilityLabel={t("facts.stPlaceAddressLabel")}
            {...inputProps}
          />
        </View>
      </Card>

      {/* მესაკუთრე */}
      <Card className="gap-3">
        <Text className="text-subtitle font-bold text-fg">
          {t("facts.stOwnerSection")}
        </Text>
        <View className="gap-1">
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
            <View className="gap-1">
              <FieldLabel label={t("facts.stPersonalIdLabel")} required />
              <TextInput
                value={form.ownerPersonalId}
                onChangeText={(v) => onChange("ownerPersonalId", v)}
                keyboardType="number-pad"
                className={INPUT_CLASS}
                accessibilityLabel={t("facts.stPersonalIdLabel")}
                {...inputProps}
              />
            </View>
            <View className="gap-1">
              <FieldLabel label={t("facts.stFirstNameLabel")} required />
              <TextInput
                value={form.ownerFirstName}
                onChangeText={(v) => onChange("ownerFirstName", v)}
                className={INPUT_CLASS}
                accessibilityLabel={t("facts.stFirstNameLabel")}
                {...inputProps}
              />
            </View>
            <View className="gap-1">
              <FieldLabel label={t("facts.stLastNameLabel")} required />
              <TextInput
                value={form.ownerLastName}
                onChangeText={(v) => onChange("ownerLastName", v)}
                className={INPUT_CLASS}
                accessibilityLabel={t("facts.stLastNameLabel")}
                {...inputProps}
              />
            </View>
            <View className="gap-1">
              <FieldLabel label={t("facts.stOwnerAddressLabel")} required />
              <TextInput
                value={form.ownerAddress}
                onChangeText={(v) => onChange("ownerAddress", v)}
                className={`${INPUT_CLASS} min-h-[80px]`}
                multiline
                accessibilityLabel={t("facts.stOwnerAddressLabel")}
                {...inputProps}
              />
            </View>
          </>
        ) : null}
        {form.ownerKind === "legal" ? (
          <>
            <View className="gap-1">
              <FieldLabel label={t("facts.stOwnerLegalCodeLabel")} required />
              <TextInput
                value={form.ownerLegalCode}
                onChangeText={(v) => onChange("ownerLegalCode", v)}
                keyboardType="number-pad"
                className={INPUT_CLASS}
                accessibilityLabel={t("facts.stOwnerLegalCodeLabel")}
                {...inputProps}
              />
            </View>
            <View className="gap-1">
              <FieldLabel label={t("facts.stOwnerLegalNameLabel")} required />
              <TextInput
                value={form.ownerLegalName}
                onChangeText={(v) => onChange("ownerLegalName", v)}
                className={INPUT_CLASS}
                accessibilityLabel={t("facts.stOwnerLegalNameLabel")}
                {...inputProps}
              />
            </View>
            <View className="gap-1">
              <FieldLabel label={t("facts.stOwnerAddressLabel")} required />
              <TextInput
                value={form.ownerAddress}
                onChangeText={(v) => onChange("ownerAddress", v)}
                className={`${INPUT_CLASS} min-h-[80px]`}
                multiline
                accessibilityLabel={t("facts.stOwnerAddressLabel")}
                {...inputProps}
              />
            </View>
          </>
        ) : null}
      </Card>

      {/* მოთხოვნა */}
      <Card className="gap-2">
        <FieldLabel label={t("facts.stRequestLabel")} required />
        <TextInput
          value={form.request}
          onChangeText={(v) => onChange("request", v)}
          className={`${INPUT_CLASS} min-h-[80px]`}
          multiline
          accessibilityLabel={t("facts.stRequestLabel")}
          {...inputProps}
        />
      </Card>

      {error ? <Text className="text-caption text-danger">{error}</Text> : null}
      <Text className="text-caption text-fg-muted">
        {t("facts.stRequiredHint")}
      </Text>
      <Button label={t("facts.stRecordButton")} onPress={onContinue} />
    </>
  );
}
