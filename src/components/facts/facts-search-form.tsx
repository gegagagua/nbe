import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { CaseFilterField } from "@/components/cases/case-filter-field";
import { Button, Card, PressableScale } from "@/components/ui";
import { DatePickerField } from "@/components/ui/date-picker-field";
import { useAppTheme } from "@/theme";
import type { FactsSearchFilters } from "@/types/facts";

type Props = {
  values: FactsSearchFilters;
  onChange: (next: FactsSearchFilters) => void;
  onSearch: () => void;
  onClear: () => void;
};

/**
 * Collapsible filter panel for the Statement of Facts list — feeds
 * `regnumber` / `regDateFrom` / `regDateTo` into `searchFacts`. Dates are typed
 * as `YYYY-MM-DD`, matching the payload the fact-portal search expects.
 */
export function FactsSearchForm({ values, onChange, onSearch, onClear }: Props) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const setValue = <K extends keyof FactsSearchFilters>(
    key: K,
    value: FactsSearchFilters[K],
  ) => onChange({ ...values, [key]: value });

  const datePlaceholder = t("facts.datePlaceholder");
  const weekdays = t("facts.pickerWeekdays").split(",");
  const months = t("facts.pickerMonths").split(",");

  return (
    <Card className="gap-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-subtitle font-bold text-fg">
          {t("facts.filtersTitle")}
        </Text>
        <PressableScale
          className="h-9 w-9 items-center justify-center rounded-md border border-border bg-surface-sunken"
          onPress={() => setIsPanelOpen((v) => !v)}
          accessibilityRole="button"
          accessibilityLabel={
            isPanelOpen ? t("facts.filtersCollapse") : t("facts.filtersExpand")
          }
        >
          <MaterialCommunityIcons
            name={isPanelOpen ? "chevron-up" : "chevron-down"}
            size={22}
            color={colors.text}
          />
        </PressableScale>
      </View>
      {isPanelOpen ? (
        <View className="gap-3">
          <View className="gap-1">
            <Text className="text-label font-semibold text-fg-secondary">
              {t("facts.regNumberLabel")}
            </Text>
            <CaseFilterField
              value={values.regnumber ?? ""}
              onChangeText={(v) => setValue("regnumber", v)}
              placeholder={t("facts.regNumberPlaceholder")}
            />
          </View>
          <View className="gap-1">
            <Text className="text-label font-semibold text-fg-secondary">
              {t("facts.regPeriodLabel")}
            </Text>
            <View className="flex-row gap-3">
              <View className="flex-1">
                <DatePickerField
                  value={values.regDateFrom ?? ""}
                  onChange={(v) => setValue("regDateFrom", v)}
                  placeholder={datePlaceholder}
                  weekdays={weekdays}
                  months={months}
                  clearLabel={t("facts.pickerClear")}
                  closeLabel={t("facts.pickerClose")}
                />
              </View>
              <View className="flex-1">
                <DatePickerField
                  value={values.regDateTo ?? ""}
                  onChange={(v) => setValue("regDateTo", v)}
                  placeholder={datePlaceholder}
                  weekdays={weekdays}
                  months={months}
                  clearLabel={t("facts.pickerClear")}
                  closeLabel={t("facts.pickerClose")}
                />
              </View>
            </View>
          </View>
          <View className="gap-1">
            <Text className="text-label font-semibold text-fg-secondary">
              {t("facts.payCodeLabel")}
            </Text>
            <CaseFilterField
              value={values.payCode ?? ""}
              onChangeText={(v) => setValue("payCode", v)}
              placeholder={t("facts.payCodePlaceholder")}
            />
          </View>
          <View className="gap-2">
            <Button label={t("facts.searchButton")} onPress={onSearch} />
            <Button
              label={t("facts.clearButton")}
              onPress={onClear}
              variant="destructive"
            />
          </View>
        </View>
      ) : null}
    </Card>
  );
}
