import { useState } from 'react';
import { Platform, Pressable, Text, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { DebtorRegistryFiltersProps } from '@/types/debtor-registry';

import { debtorRegistryFiltersStyles as s } from './debtor-registry-filters.styles';

export function DebtorRegistryFilters({
  values,
  onChange,
  onSearch,
  onClear,
}: DebtorRegistryFiltersProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={[s.panel, Platform.OS === 'web' && s.panelWeb]}>
      <View style={s.titleRow}>
        <Text style={s.title}>{t('debtors.filtersTitle')}</Text>
        <Pressable style={s.toggleButton} onPress={() => setIsExpanded((prev) => !prev)}>
          <Text style={s.toggleText}>
            {isExpanded ? t('debtors.filtersCollapse') : t('debtors.filtersExpand')}
          </Text>
        </Pressable>
      </View>

      {isExpanded && (
        <>
          <Text style={s.label}>{t('debtors.idNumberLabel')}</Text>
          <TextInput
            style={s.input}
            value={values.idnumber ?? ''}
            onChangeText={(idnumber) => onChange({ ...values, idnumber })}
          />

          <Text style={s.label}>{t('debtors.firstNameLabel')}</Text>
          <TextInput
            style={s.input}
            value={values.firstName ?? ''}
            onChangeText={(firstName) => onChange({ ...values, firstName })}
          />

          <Text style={s.label}>{t('debtors.lastNameLabel')}</Text>
          <TextInput
            style={s.input}
            value={values.lastName ?? ''}
            onChangeText={(lastName) => onChange({ ...values, lastName })}
          />

          <Text style={s.label}>{t('debtors.organizationLabel')}</Text>
          <TextInput
            style={s.input}
            value={values.organization ?? ''}
            onChangeText={(organization) => onChange({ ...values, organization })}
          />

          <Text style={s.label}>{t('debtors.periodLabel')}</Text>
          <View style={s.dateRow}>
            <TextInput
              style={[s.input, s.dateInput]}
              placeholder={t('debtors.periodFromPlaceholder')}
              value={values.docDateFrom ?? ''}
              onChangeText={(docDateFrom) => onChange({ ...values, docDateFrom })}
            />
            <TextInput
              style={[s.input, s.dateInput]}
              placeholder={t('debtors.periodToPlaceholder')}
              value={values.docDateTo ?? ''}
              onChangeText={(docDateTo) => onChange({ ...values, docDateTo })}
            />
          </View>

          <View style={s.actions}>
            <Pressable style={s.searchButton} onPress={onSearch}>
              <Text style={s.searchText}>{t('debtors.searchButton')}</Text>
            </Pressable>
            <Pressable style={s.clearButton} onPress={onClear}>
              <Text style={s.clearText}>{t('debtors.clearButton')}</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}
