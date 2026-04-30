import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { CaseManagementCopy as C } from '@/constants/case-management-copy';
import { DebtorRegistryLayout, DebtorRegistryPalette } from '@/constants/debtor-registry';
import type { CaseFiltersProps, CaseSearchFilters } from '@/types/case-management';

import { CaseFiltersAdvancedFields } from './case-filters-advanced-fields';
import { caseFiltersStyles as s } from './case-filters.styles';
import { CaseParticipantSearch } from './case-participant-search';

export function CaseFilters({ values, onChange, onSearch, onClear }: CaseFiltersProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isAdvancedExpanded, setIsAdvancedExpanded] = useState(false);
  const setValue = <K extends keyof CaseSearchFilters>(key: K, value: CaseSearchFilters[K]) =>
    onChange({ ...values, [key]: value });

  return (
    <View style={s.panel}>
      <View style={s.titleRow}>
        <Text style={s.title}>{C.filtersTitle}</Text>
        <Pressable
          style={s.toggleButton}
          onPress={() => setIsPanelOpen((v) => !v)}
          accessibilityRole="button"
          accessibilityLabel={isPanelOpen ? C.filtersPanelCollapse : C.filtersPanelExpand}
        >
          <MaterialCommunityIcons
            name={isPanelOpen ? 'chevron-up' : 'chevron-down'}
            size={DebtorRegistryLayout.filterPanelIconSize}
            color={DebtorRegistryPalette.textPrimary}
          />
        </Pressable>
      </View>
      {isPanelOpen && (
        <CaseParticipantSearch values={values} onChange={onChange} />
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
