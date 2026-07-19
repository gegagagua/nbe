import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { SearchActions } from '@/components/ui/search-actions';
import { DebtorRegistryLayout, DebtorRegistryPalette } from '@/constants/debtor-registry';
import type { CaseFiltersProps, CaseSearchFilters } from '@/types/case-management';

import { caseFiltersStyles as s } from './case-filters.styles';
import { CaseParticipantSearch } from './case-participant-search';

export function CaseFilters({ values, onChange, onSearch, onClear }: CaseFiltersProps) {
  const { t } = useTranslation();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const setValue = <K extends keyof CaseSearchFilters>(key: K, value: CaseSearchFilters[K]) =>
    onChange({ ...values, [key]: value });

  return (
    <View style={s.panel}>
      <View style={s.titleRow}>
        <Text style={s.title}>{t('cases.filtersTitle')}</Text>
        <Pressable
          style={s.toggleButton}
          onPress={() => setIsPanelOpen((v) => !v)}
          accessibilityRole="button"
          accessibilityLabel={
            isPanelOpen ? t('cases.filtersPanelCollapse') : t('cases.filtersPanelExpand')
          }>
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
      {isPanelOpen && (
        <SearchActions
          searchLabel={t('cases.searchButton')}
          clearLabel={t('cases.clearButton')}
          onSearch={onSearch}
          onClear={onClear}
        />
      )}
    </View>
  );
}
