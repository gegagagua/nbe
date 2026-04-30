import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { CaseManagementCopy as C } from '@/constants/case-management-copy';
import type { CaseFiltersProps, CaseSearchFilters } from '@/types/case-management';

import { CaseParticipantSearch } from './case-participant-search';
import { caseFiltersStyles as s } from './case-filters.styles';
import { CaseFiltersAdvancedFields } from './case-filters-advanced-fields';

export function CaseFilters({ values, onChange, onSearch, onClear }: CaseFiltersProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isAdvancedExpanded, setIsAdvancedExpanded] = useState(false);
  const setValue = <K extends keyof CaseSearchFilters>(key: K, value: CaseSearchFilters[K]) =>
    onChange({ ...values, [key]: value });

  return (
    <View style={s.panel}>
      <View style={s.titleRow}>
        <Text style={s.title}>{C.filtersTitle}</Text>
        <Pressable style={s.toggleButton} onPress={() => setIsPanelOpen((v) => !v)}>
          <Text style={s.toggleText}>
            {isPanelOpen ? C.filtersPanelCollapse : C.filtersPanelExpand}
          </Text>
        </Pressable>
      </View>
      {isPanelOpen && (
        <>
          <CaseParticipantSearch values={values} onChange={onChange} />
          <View style={s.titleRow}>
            <View style={s.titleRowSpacer} />
            <Pressable style={s.toggleButton} onPress={() => setIsAdvancedExpanded((v) => !v)}>
              <Text style={s.toggleText}>
                {isAdvancedExpanded ? C.filtersCollapse : C.filtersExpand}
              </Text>
            </Pressable>
          </View>
        </>
      )}
      {isPanelOpen && isAdvancedExpanded && (
        <CaseFiltersAdvancedFields values={values} setValue={setValue} />
      )}
      {isPanelOpen && (
        <View style={s.actions}>
          <Pressable style={s.searchButton} onPress={onSearch}>
            <Text style={s.searchText}>{C.searchButton}</Text>
          </Pressable>
          <Pressable style={s.clearButton} onPress={onClear}>
            <Text style={s.clearText}>{C.clearButton}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
