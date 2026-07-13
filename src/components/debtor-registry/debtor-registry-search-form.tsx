import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { CaseFilterField } from '@/components/cases/case-filter-field';
import { DebtorRegistryLayout, DebtorRegistryPalette } from '@/constants/debtor-registry';

import { debtorRegistrySearchFormStyles as s } from './debtor-registry-search-form.styles';

type Props = {
  applicantValue: string;
  onApplicantChange: (v: string) => void;
  onSearch: () => void;
  onClear: () => void;
};

export function DebtorRegistrySearchForm({
  applicantValue,
  onApplicantChange,
  onSearch,
  onClear,
}: Props) {
  const { t } = useTranslation();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const applicantFilled = applicantValue.trim().length > 0;
  return (
    <View style={s.panel}>
      <View style={s.titleRow}>
        <Text style={s.title}>{t('debtors.filtersTitle')}</Text>
        <Pressable
          style={s.toggleButton}
          onPress={() => setIsPanelOpen((v) => !v)}
          accessibilityRole="button"
          accessibilityLabel={
            isPanelOpen ? t('debtors.filtersCollapse') : t('debtors.filtersExpand')
          }>
          <MaterialCommunityIcons
            name={isPanelOpen ? 'chevron-up' : 'chevron-down'}
            size={DebtorRegistryLayout.filterPanelIconSize}
            color={DebtorRegistryPalette.textPrimary}
          />
        </Pressable>
      </View>
      {isPanelOpen ? (
        <>
          <View style={s.wrap}>
            <Text style={s.label}>{t('debtors.searchSubjectIdLabel')}</Text>
            <CaseFilterField
              value={applicantValue}
              onChangeText={onApplicantChange}
              placeholder={t('debtors.searchSubjectIdPlaceholder')}
            />
          </View>
          <View style={s.actions}>
            <Pressable
              style={[s.searchButton, !applicantFilled && s.searchButtonDisabled]}
              onPress={onSearch}
              disabled={!applicantFilled}
              accessibilityRole="button">
              <Text style={s.searchText}>{t('debtors.searchButton')}</Text>
            </Pressable>
            <Pressable style={s.clearButton} onPress={onClear} accessibilityRole="button">
              <Text style={s.clearText}>{t('debtors.clearButton')}</Text>
            </Pressable>
          </View>
        </>
      ) : null}
    </View>
  );
}
