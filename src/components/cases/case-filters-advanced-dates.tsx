import { Text, View } from 'react-native';
import type { TFunction } from 'i18next';

import { Input } from '@/components/ui/input';
import type { CaseSearchFilters } from '@/types/case-management';

import { caseFiltersStyles as s } from './case-filters.styles';

type Props = {
  t: TFunction;
  datePh: string;
  values: CaseSearchFilters;
  setValue: <K extends keyof CaseSearchFilters>(key: K, value: CaseSearchFilters[K]) => void;
};

export function CaseFiltersAdvancedDates({ t, datePh, values, setValue }: Props) {
  return (
    <>
      <Text style={s.label}>{t('cases.regPeriodLabel')}</Text>
      <View style={s.row}>
        <View style={s.half}>
          <Input
            value={values.regDateFrom ?? ''}
            onChangeText={(v) => setValue('regDateFrom', v)}
            placeholder={datePh}
          />
        </View>
        <View style={s.half}>
          <Input
            value={values.regDateTo ?? ''}
            onChangeText={(v) => setValue('regDateTo', v)}
            placeholder={datePh}
          />
        </View>
      </View>
      <Text style={s.label}>{t('cases.statusPeriodLabel')}</Text>
      <View style={s.row}>
        <View style={s.half}>
          <Input
            value={values.statusDateFrom ?? ''}
            onChangeText={(v) => setValue('statusDateFrom', v)}
            placeholder={datePh}
          />
        </View>
        <View style={s.half}>
          <Input
            value={values.statusDateTo ?? ''}
            onChangeText={(v) => setValue('statusDateTo', v)}
            placeholder={datePh}
          />
        </View>
      </View>
    </>
  );
}
