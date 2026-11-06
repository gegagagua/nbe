import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { CaseSearchFilters } from '@/types/case-management';

import { CaseFilterField } from './case-filter-field';
import { CaseFiltersAdvancedDates } from './case-filters-advanced-dates';
import { CaseFilterToggleRow } from './case-filter-toggle-row';

const initialSource: ('MANUAL' | 'ELECTRONIC')[] = ['MANUAL', 'ELECTRONIC'];

const toggleRows = [
  { key: 'automaticProcess' as const, labelKey: 'cases.autoProcessLabel' as const },
  { key: 'updateByDate' as const, labelKey: 'cases.updateByDateLabel' as const },
  { key: 'conditional' as const, labelKey: 'cases.conditionalLabel' as const },
  { key: 'immediateEnf' as const, labelKey: 'cases.immediateEnfLabel' as const },
];

type Props = {
  values: CaseSearchFilters;
  setValue: <K extends keyof CaseSearchFilters>(key: K, value: CaseSearchFilters[K]) => void;
};

export function CaseFiltersAdvancedFields({ values, setValue }: Props) {
  const { t } = useTranslation();
  const datePh = t('cases.dateIsoPlaceholder');

  return (
    <>
      <CaseFilterField
        placeholder={t('cases.orgTypeLabel')}
        value={values.orgTypeId ?? ''}
        onChangeText={(v) => setValue('orgTypeId', v)}
      />
      <CaseFilterField
        placeholder={t('cases.orgLabel')}
        value={values.organization ?? ''}
        onChangeText={(v) => setValue('organization', v)}
      />
      <CaseFilterField
        placeholder={t('cases.trTypeLabel')}
        value={values.trTypeId ?? ''}
        onChangeText={(v) => setValue('trTypeId', v)}
      />
      <CaseFilterField
        placeholder={t('cases.transferStatusLabel')}
        value={values.transferStatusId ?? ''}
        onChangeText={(v) => setValue('transferStatusId', v)}
      />
      <Text className="text-label font-semibold text-fg">{t('cases.sourceLabel')}</Text>
      <View className="flex-row gap-2">
        {initialSource.map((item) => (
          <Pressable
            key={item}
            className="flex-1 h-9 border border-border rounded-sm bg-input px-2 justify-center"
            onPress={() => setValue('sourceType', item)}>
            <Text className="text-fg">{item}</Text>
          </Pressable>
        ))}
      </View>
      <CaseFiltersAdvancedDates t={t} datePh={datePh} values={values} setValue={setValue} />
      <CaseFilterField
        placeholder={t('cases.participantTypeLabel')}
        value={values.participantTypeId ?? ''}
        onChangeText={(v) => setValue('participantTypeId', v)}
      />
      <CaseFilterField
        placeholder={t('cases.addressLabel')}
        value={values.address ?? ''}
        onChangeText={(v) => setValue('address', v)}
      />
      <CaseFilterField
        placeholder={t('cases.cadastralCodeLabel')}
        value={values.cadastralCode ?? ''}
        onChangeText={(v) => setValue('cadastralCode', v)}
      />
      <CaseFilterField
        placeholder={t('cases.vehicleNoLabel')}
        value={values.vehicleNumber ?? ''}
        onChangeText={(v) => setValue('vehicleNumber', v)}
      />
      {toggleRows.map(({ key, labelKey }) => (
        <CaseFilterToggleRow
          key={key}
          label={t(labelKey)}
          value={values[key]}
          onChange={(v) => setValue(key, v)}
        />
      ))}
    </>
  );
}
