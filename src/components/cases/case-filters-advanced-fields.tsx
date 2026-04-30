import { Pressable, Text, View } from 'react-native';

import { Input } from '@/components/ui/input';
import { CaseManagementCopy as C } from '@/constants/case-management-copy';
import type { CaseSearchFilters } from '@/types/case-management';

import { CaseFilterField } from './case-filter-field';
import { CaseFilterToggleRow } from './case-filter-toggle-row';
import { caseFiltersStyles as s } from './case-filters.styles';

const initialSource: ('MANUAL' | 'ELECTRONIC')[] = ['MANUAL', 'ELECTRONIC'];

type Props = {
  values: CaseSearchFilters;
  setValue: <K extends keyof CaseSearchFilters>(key: K, value: CaseSearchFilters[K]) => void;
};

export function CaseFiltersAdvancedFields({ values, setValue }: Props) {
  return (
    <>
      <CaseFilterField
        placeholder={C.orgTypeLabel}
        value={values.orgTypeId ?? ''}
        onChangeText={(v) => setValue('orgTypeId', v)}
      />
      <CaseFilterField
        placeholder={C.orgLabel}
        value={values.organization ?? ''}
        onChangeText={(v) => setValue('organization', v)}
      />
      <CaseFilterField
        placeholder={C.trTypeLabel}
        value={values.trTypeId ?? ''}
        onChangeText={(v) => setValue('trTypeId', v)}
      />
      <CaseFilterField
        placeholder={C.transferStatusLabel}
        value={values.transferStatusId ?? ''}
        onChangeText={(v) => setValue('transferStatusId', v)}
      />
      <Text style={s.label}>{C.sourceLabel}</Text>
      <View style={s.row}>
        {initialSource.map((item) => (
          <Pressable key={item} style={[s.input, s.half]} onPress={() => setValue('sourceType', item)}>
            <Text>{item}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={s.label}>{C.regPeriodLabel}</Text>
      <View style={s.row}>
        <View style={s.half}>
          <Input
            value={values.regDateFrom ?? ''}
            onChangeText={(v) => setValue('regDateFrom', v)}
            placeholder="YYYY-MM-DD"
          />
        </View>
        <View style={s.half}>
          <Input
            value={values.regDateTo ?? ''}
            onChangeText={(v) => setValue('regDateTo', v)}
            placeholder="YYYY-MM-DD"
          />
        </View>
      </View>
      <Text style={s.label}>{C.statusPeriodLabel}</Text>
      <View style={s.row}>
        <View style={s.half}>
          <Input
            value={values.statusDateFrom ?? ''}
            onChangeText={(v) => setValue('statusDateFrom', v)}
            placeholder="YYYY-MM-DD"
          />
        </View>
        <View style={s.half}>
          <Input
            value={values.statusDateTo ?? ''}
            onChangeText={(v) => setValue('statusDateTo', v)}
            placeholder="YYYY-MM-DD"
          />
        </View>
      </View>
      <CaseFilterField
        placeholder={C.participantTypeLabel}
        value={values.participantTypeId ?? ''}
        onChangeText={(v) => setValue('participantTypeId', v)}
      />
      <CaseFilterField
        placeholder={C.addressLabel}
        value={values.address ?? ''}
        onChangeText={(v) => setValue('address', v)}
      />
      <CaseFilterField
        placeholder={C.cadastralCodeLabel}
        value={values.cadastralCode ?? ''}
        onChangeText={(v) => setValue('cadastralCode', v)}
      />
      <CaseFilterField
        placeholder={C.vehicleNoLabel}
        value={values.vehicleNumber ?? ''}
        onChangeText={(v) => setValue('vehicleNumber', v)}
      />
      <CaseFilterToggleRow label={C.autoProcessLabel} value={values.automaticProcess} onChange={(v) => setValue('automaticProcess', v)} />
      <CaseFilterToggleRow label={C.updateByDateLabel} value={values.updateByDate} onChange={(v) => setValue('updateByDate', v)} />
      <CaseFilterToggleRow label={C.conditionalLabel} value={values.conditional} onChange={(v) => setValue('conditional', v)} />
      <CaseFilterToggleRow label={C.immediateEnfLabel} value={values.immediateEnf} onChange={(v) => setValue('immediateEnf', v)} />
    </>
  );
}
