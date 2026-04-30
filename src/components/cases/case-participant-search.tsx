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
        label={C.personalIdNumberLabel}
        value={values.idnumber ?? ''}
        onChangeText={(v) => setValue('idnumber', v)}
      />
      <CaseFilterField
        label={C.legalIdentificationCodeLabel}
        value={values.legalIdentificationCode ?? ''}
        onChangeText={(v) => setValue('legalIdentificationCode', v)}
      />
      <CaseFilterField
        label={C.firstNameLabel}
        value={values.firstName ?? ''}
        onChangeText={(v) => setValue('firstName', v)}
      />
      <CaseFilterField
        label={C.lastNameLabel}
        value={values.lastName ?? ''}
        onChangeText={(v) => setValue('lastName', v)}
      />
      <CaseFilterField
        label={C.organizationNameLabel}
        value={values.organizationName ?? ''}
        onChangeText={(v) => setValue('organizationName', v)}
      />
      <CaseFilterField
        label={C.enforcementSheetNoLabel}
        value={values.postNumber ?? ''}
        onChangeText={(v) => setValue('postNumber', v)}
      />
      <CaseFilterField
        label={C.appRegNoLabel}
        value={values.appRegNo ?? ''}
        onChangeText={(v) => setValue('appRegNo', v)}
      />
      <CaseFilterField
        label={C.paymentIdLabel}
        value={values.paymentIdentifier ?? ''}
        onChangeText={(v) => setValue('paymentIdentifier', v)}
      />
    </View>
  );
}
