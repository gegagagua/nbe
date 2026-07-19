import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { CaseFilterField } from '@/components/cases/case-filter-field';
import { SearchActions } from '@/components/ui/search-actions';
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
  const [idError, setIdError] = useState(false);
  const applicantFilled = applicantValue.trim().length > 0;

  // Personal ID number is 11 digits; organization identification code is 9.
  const isIdValid = (value: string) => /^\d{9}$|^\d{11}$/.test(value);

  const handleChange = (v: string) => {
    onApplicantChange(v.replace(/\D/g, ''));
    if (idError) setIdError(false);
  };

  const handleSearch = () => {
    if (!isIdValid(applicantValue.trim())) {
      setIdError(true);
      return;
    }
    onSearch();
  };

  const handleClear = () => {
    setIdError(false);
    onClear();
  };
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
              onChangeText={handleChange}
              placeholder={t('debtors.searchSubjectIdPlaceholder')}
              keyboardType="number-pad"
            />
            {idError ? (
              <Text style={s.errorText}>{t('debtors.detailEditIdError')}</Text>
            ) : null}
          </View>
          <SearchActions
            searchLabel={t('debtors.searchButton')}
            clearLabel={t('debtors.clearButton')}
            onSearch={handleSearch}
            onClear={handleClear}
            searchDisabled={!applicantFilled}
          />
        </>
      ) : null}
    </View>
  );
}
