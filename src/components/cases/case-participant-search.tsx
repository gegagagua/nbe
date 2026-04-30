import { Text, View } from 'react-native';

import { CaseManagementCopy as C } from '@/constants/case-management-copy';
import type { CaseFiltersProps, CaseSearchFilters } from '@/types/case-management';

import { CaseFilterField } from './case-filter-field';
import { caseFiltersStyles as s } from './case-filters.styles';

export function CaseParticipantSearch({ values, onChange }: Pick<CaseFiltersProps, 'onChange' | 'values'>) {
  const setValue = <K extends keyof CaseSearchFilters>(key: K, value: CaseSearchFilters[K]) =>
    onChange({ ...values, [key]: value });

  return (
    <View style={s.participantBlock}>
      <Text style={s.sectionTitle}>{C.participantSearchTitle}</Text>
      <CaseFilterField
        placeholder={C.participantFilterAppRegPlaceholder}
        value={values.appRegNo ?? ''}
        onChangeText={(v) => setValue('appRegNo', v)}
      />
      <CaseFilterField
        placeholder={C.participantFilterEnforcementSheetPlaceholder}
        value={values.postNumber ?? ''}
        onChangeText={(v) => setValue('postNumber', v)}
      />
      <CaseFilterField
        placeholder={C.participantFilterPaymentIdPlaceholder}
        value={values.paymentIdentifier ?? ''}
        onChangeText={(v) => setValue('paymentIdentifier', v)}
      />
      <CaseFilterField
        placeholder={C.participantFilterPersonalIdPlaceholder}
        value={values.idnumber ?? ''}
        onChangeText={(v) => setValue('idnumber', v)}
      />
      <CaseFilterField
        placeholder={C.firstNameLabel}
        value={values.firstName ?? ''}
        onChangeText={(v) => setValue('firstName', v)}
      />
      <CaseFilterField
        placeholder={C.lastNameLabel}
        value={values.lastName ?? ''}
        onChangeText={(v) => setValue('lastName', v)}
      />
      <CaseFilterField
        placeholder={C.participantFilterLegalIdPlaceholder}
        value={values.legalIdentificationCode ?? ''}
        onChangeText={(v) => setValue('legalIdentificationCode', v)}
      />
      <CaseFilterField
        placeholder={C.organizationNameLabel}
        value={values.organizationName ?? ''}
        onChangeText={(v) => setValue('organizationName', v)}
      />
    </View>
  );
}
