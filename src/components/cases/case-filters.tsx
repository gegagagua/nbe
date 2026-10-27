import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { SearchActions } from '@/components/ui/search-actions';
import { useAppTheme } from '@/theme';
import type { CaseFiltersProps, CaseSearchFilters } from '@/types/case-management';

import { CaseParticipantSearch } from './case-participant-search';

export function CaseFilters({ values, onChange, onSearch, onClear }: CaseFiltersProps) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const setValue = <K extends keyof CaseSearchFilters>(key: K, value: CaseSearchFilters[K]) =>
    onChange({ ...values, [key]: value });

  return (
    <View className="w-full rounded-md border border-border bg-surface-sunken p-4 gap-2">
      <View className="flex-row items-center justify-between">
        <Text className="text-body-lg font-bold text-fg">{t('cases.filtersTitle')}</Text>
        <Pressable
          className="rounded-sm border border-border bg-input px-2 py-2 items-center justify-center"
          onPress={() => setIsPanelOpen((v) => !v)}
          accessibilityRole="button"
          accessibilityLabel={
            isPanelOpen ? t('cases.filtersPanelCollapse') : t('cases.filtersPanelExpand')
          }>
          <MaterialCommunityIcons
            name={isPanelOpen ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={colors.text}
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
