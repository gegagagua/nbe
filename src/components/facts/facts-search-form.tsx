import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

import { CaseFilterField } from "@/components/cases/case-filter-field";
import { caseFiltersStyles as s } from "@/components/cases/case-filters.styles";
import { DatePickerField } from "@/components/ui/date-picker-field";
import {
  DebtorRegistryLayout,
  DebtorRegistryPalette,
} from "@/constants/debtor-registry";
import type { FactsSearchFilters } from "@/types/facts";

import { factsSearchFormStyles as fs } from "./facts-search-form.styles";

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
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const setValue = <K extends keyof FactsSearchFilters>(
    key: K,
    value: FactsSearchFilters[K],
  ) => onChange({ ...values, [key]: value });

  const datePlaceholder = t("facts.datePlaceholder");
  const weekdays = t("facts.pickerWeekdays").split(",");
  const months = t("facts.pickerMonths").split(",");

  return (
    <View style={s.panel}>
      <View style={s.titleRow}>
        <Text style={s.title}>{t("facts.filtersTitle")}</Text>
        <Pressable
          style={s.toggleButton}
          onPress={() => setIsPanelOpen((v) => !v)}
          accessibilityRole="button"
          accessibilityLabel={
            isPanelOpen ? t("facts.filtersCollapse") : t("facts.filtersExpand")
          }
        >
          <MaterialCommunityIcons
            name={isPanelOpen ? "chevron-up" : "chevron-down"}
            size={DebtorRegistryLayout.filterPanelIconSize}
            color={DebtorRegistryPalette.textPrimary}
          />
        </Pressable>
      </View>
      {isPanelOpen ? (
        <>
          <Text style={s.label}>{t("facts.regNumberLabel")}</Text>
          <CaseFilterField
            value={values.regnumber ?? ""}
            onChangeText={(v) => setValue("regnumber", v)}
            placeholder={t("facts.regNumberPlaceholder")}
          />
          <Text style={s.label}>{t("facts.regPeriodLabel")}</Text>
          <View style={s.row}>
            <View style={s.half}>
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
            <View style={s.half}>
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
          <Text style={s.label}>{t("facts.payCodeLabel")}</Text>
          <CaseFilterField
            value={values.payCode ?? ""}
            onChangeText={(v) => setValue("payCode", v)}
            placeholder={t("facts.payCodePlaceholder")}
          />
          <View style={fs.actions}>
            <Pressable
              style={fs.searchButton}
              onPress={onSearch}
              accessibilityRole="button"
            >
              <Text style={fs.searchText}>{t("facts.searchButton")}</Text>
            </Pressable>
            <Pressable
              style={fs.clearButton}
              onPress={onClear}
              accessibilityRole="button"
            >
              <Text style={fs.clearText}>{t("facts.clearButton")}</Text>
            </Pressable>
          </View>
        </>
      ) : null}
    </View>
  );
}
