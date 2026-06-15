import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import type { CaseFiltersProps, CaseSearchFilters } from '@/types/case-management';

import { CaseFilterField } from './case-filter-field';
import { caseFiltersStyles as s } from './case-filters.styles';

export function CaseParticipantSearch({ values, onChange }: Pick<CaseFiltersProps, 'onChange' | 'values'>) {
  const { t } = useTranslation();
  const setValue = <K extends keyof CaseSearchFilters>(key: K, value: CaseSearchFilters[K]) =>
    onChange({ ...values, [key]: value });

  return (
    <View style={s.participantBlock}>
      <Text style={s.sectionTitle}>{t('cases.participantSearchTitle')}</Text>
      <CaseFilterField
        placeholder={t('cases.participantFilterRegnumberPlaceholder')}
        value={values.appRegNo ?? ''}
        onChangeText={(v) => setValue('appRegNo', v)}
      />
      <CaseFilterField
        placeholder={t('cases.participantFilterDocNoPlaceholder')}
        value={values.docNo ?? ''}
        onChangeText={(v) => setValue('docNo', v)}
      />
      <CaseFilterField
        placeholder={t('cases.participantFilterPaymentIdPlaceholder')}
        value={values.paymentIdentifier ?? ''}
        onChangeText={(v) => setValue('paymentIdentifier', v)}
      />
      <CaseFilterField
        placeholder={t('cases.participantFilterPersonalIdPlaceholder')}
        value={values.idnumber ?? ''}
        onChangeText={(v) => setValue('idnumber', v)}
      />
      <CaseFilterField
        placeholder={t('cases.firstNameLabel')}
        value={values.firstName ?? ''}
        onChangeText={(v) => setValue('firstName', v)}
      />
      <CaseFilterField
        placeholder={t('cases.lastNameLabel')}
        value={values.lastName ?? ''}
        onChangeText={(v) => setValue('lastName', v)}
      />
      <CaseFilterField
        placeholder={t('cases.organizationNameLabel')}
        value={values.organizationName ?? ''}
        onChangeText={(v) => setValue('organizationName', v)}
      />
    </View>
  );
}
