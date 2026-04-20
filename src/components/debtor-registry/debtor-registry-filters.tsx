import { useState } from 'react';
import { Platform, Pressable, Text, TextInput, View } from 'react-native';

import { DebtorRegistryCopy } from '@/constants/debtor-registry-copy';
import type { DebtorRegistryFiltersProps } from '@/types/debtor-registry';

import { debtorRegistryFiltersStyles as s } from './debtor-registry-filters.styles';

export function DebtorRegistryFilters({
  values,
  onChange,
  onSearch,
  onClear,
}: DebtorRegistryFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={[s.panel, Platform.OS === 'web' && s.panelWeb]}>
      <View style={s.titleRow}>
        <Text style={s.title}>{DebtorRegistryCopy.filtersTitle}</Text>
        <Pressable style={s.toggleButton} onPress={() => setIsExpanded((prev) => !prev)}>
          <Text style={s.toggleText}>
            {isExpanded ? DebtorRegistryCopy.filtersCollapse : DebtorRegistryCopy.filtersExpand}
          </Text>
        </Pressable>
      </View>

      {isExpanded && (
        <>
          <Text style={s.label}>{DebtorRegistryCopy.idNumberLabel}</Text>
          <TextInput
            style={s.input}
            value={values.idnumber ?? ''}
            onChangeText={(idnumber) => onChange({ ...values, idnumber })}
          />

          <Text style={s.label}>{DebtorRegistryCopy.firstNameLabel}</Text>
          <TextInput
            style={s.input}
            value={values.firstName ?? ''}
            onChangeText={(firstName) => onChange({ ...values, firstName })}
          />

          <Text style={s.label}>{DebtorRegistryCopy.lastNameLabel}</Text>
          <TextInput
            style={s.input}
            value={values.lastName ?? ''}
            onChangeText={(lastName) => onChange({ ...values, lastName })}
          />

          <Text style={s.label}>{DebtorRegistryCopy.organizationLabel}</Text>
          <TextInput
            style={s.input}
            value={values.organization ?? ''}
            onChangeText={(organization) => onChange({ ...values, organization })}
          />

          <Text style={s.label}>{DebtorRegistryCopy.periodLabel}</Text>
          <View style={s.dateRow}>
            <TextInput
              style={[s.input, s.dateInput]}
              placeholder={DebtorRegistryCopy.periodFromPlaceholder}
              value={values.docDateFrom ?? ''}
              onChangeText={(docDateFrom) => onChange({ ...values, docDateFrom })}
            />
            <TextInput
              style={[s.input, s.dateInput]}
              placeholder={DebtorRegistryCopy.periodToPlaceholder}
              value={values.docDateTo ?? ''}
              onChangeText={(docDateTo) => onChange({ ...values, docDateTo })}
            />
          </View>

          <View style={s.actions}>
            <Pressable style={s.searchButton} onPress={onSearch}>
              <Text style={s.searchText}>{DebtorRegistryCopy.searchButton}</Text>
            </Pressable>
            <Pressable style={s.clearButton} onPress={onClear}>
              <Text style={s.clearText}>{DebtorRegistryCopy.clearButton}</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}
