import { Text, View } from 'react-native';
import type { TFunction } from 'i18next';

import { Input } from '@/components/ui/input';
import type { CaseSearchFilters } from '@/types/case-management';

type Props = {
  t: TFunction;
  datePh: string;
  values: CaseSearchFilters;
  setValue: <K extends keyof CaseSearchFilters>(key: K, value: CaseSearchFilters[K]) => void;
};

export function CaseFiltersAdvancedDates({ t, datePh, values, setValue }: Props) {
  return (
    <>
      <Text className="text-label font-semibold text-fg">{t('cases.regPeriodLabel')}</Text>
      <View className="flex-row gap-2">
        <View className="flex-1">
          <Input
            value={values.regDateFrom ?? ''}
            onChangeText={(v) => setValue('regDateFrom', v)}
            placeholder={datePh}
          />
        </View>
        <View className="flex-1">
          <Input
            value={values.regDateTo ?? ''}
            onChangeText={(v) => setValue('regDateTo', v)}
            placeholder={datePh}
          />
        </View>
      </View>
      <Text className="text-label font-semibold text-fg">{t('cases.statusPeriodLabel')}</Text>
      <View className="flex-row gap-2">
        <View className="flex-1">
          <Input
            value={values.statusDateFrom ?? ''}
            onChangeText={(v) => setValue('statusDateFrom', v)}
            placeholder={datePh}
          />
        </View>
        <View className="flex-1">
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
