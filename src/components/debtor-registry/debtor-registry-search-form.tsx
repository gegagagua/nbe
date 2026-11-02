import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { CaseFilterField } from '@/components/cases/case-filter-field';
import { Card } from '@/components/ui/card';
import { SearchActions } from '@/components/ui/search-actions';
import { useAppTheme } from '@/theme';

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
  const { colors } = useAppTheme();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [idError, setIdError] = useState(false);
  const applicantFilled = applicantValue.trim().length > 0;

  // Personal ID number is 11 digits; organization identification code is 9.
  const isIdValid = (value: string) => /^\d{9}$|^\d{11}$/.test(value);

  const handleChange = (v: string) => {
    onApplicantChange(v.replace(/\D/g, '').slice(0, 11));
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
    <Card className="gap-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-body font-bold text-fg">{t('debtors.filtersTitle')}</Text>
        <Pressable
          className="h-9 w-9 items-center justify-center rounded-full border border-input-border bg-input"
          onPress={() => setIsPanelOpen((v) => !v)}
          accessibilityRole="button"
          accessibilityLabel={
            isPanelOpen ? t('debtors.filtersCollapse') : t('debtors.filtersExpand')
          }>
          <MaterialCommunityIcons
            name={isPanelOpen ? 'chevron-up' : 'chevron-down'}
            size={22}
            color={colors.text}
          />
        </Pressable>
      </View>
      {isPanelOpen ? (
        <>
          <View className="gap-2">
            <Text className="text-label font-semibold text-fg-secondary">
              {t('debtors.searchSubjectIdLabel')}
            </Text>
            <CaseFilterField
              value={applicantValue}
              onChangeText={handleChange}
              placeholder={t('debtors.searchSubjectIdPlaceholder')}
              keyboardType="number-pad"
            />
            {idError ? (
              <Text className="text-caption text-danger">{t('debtors.detailEditIdError')}</Text>
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
    </Card>
  );
}
