import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { CaseFilterField } from '@/components/cases/case-filter-field';
import { Button } from '@/components/ui/button';
import { DebtorRegistryLayout, DebtorRegistryPalette } from '@/constants/debtor-registry';

import { debtorRegistrySearchFormStyles as s } from './debtor-registry-search-form.styles';

type Props = {
  applicantValue: string;
  subjectValue: string;
  onApplicantChange: (v: string) => void;
  onSubjectChange: (v: string) => void;
  onSearch: () => void;
  onClear: () => void;
};

export function DebtorRegistrySearchForm({
  applicantValue,
  subjectValue,
  onApplicantChange,
  onSubjectChange,
  onSearch,
  onClear,
}: Props) {
  const { t } = useTranslation();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const bothFilled = applicantValue.trim().length > 0 && subjectValue.trim().length > 0;
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
            <Text style={s.label}>{t('debtors.searchApplicantPnLabel')}</Text>
            <CaseFilterField
              value={applicantValue}
              onChangeText={onApplicantChange}
              placeholder={t('debtors.searchApplicantPnPlaceholder')}
            />
          </View>
          <View style={s.wrap}>
            <Text style={s.label}>{t('debtors.searchSubjectIdLabel')}</Text>
            <CaseFilterField
              value={subjectValue}
              onChangeText={onSubjectChange}
              placeholder={t('debtors.searchSubjectIdPlaceholder')}
            />
          </View>
          <View style={s.actions}>
            <Button label={t('debtors.searchButton')} onPress={onSearch} disabled={!bothFilled} />
            <Pressable style={s.clearPress} onPress={onClear} accessibilityRole="button">
              <Text style={s.clearText}>{t('debtors.clearButton')}</Text>
            </Pressable>
          </View>
        </>
      ) : null}
    </View>
  );
}
