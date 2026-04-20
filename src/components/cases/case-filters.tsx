import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { CaseManagementCopy as C } from '@/constants/case-management-copy';
import type { CaseFiltersProps, CaseSearchFilters } from '@/types/case-management';

import { caseFiltersStyles as s } from './case-filters.styles';

function Field({
  label,
  value,
  onChangeText,
  placeholder,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <>
      <Text style={s.label}>{label}</Text>
      <TextInput style={s.input} value={value} onChangeText={onChangeText} placeholder={placeholder} />
    </>
  );
}

function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean | undefined;
  onChange: (next: boolean) => void;
}) {
  return (
    <Pressable style={s.checkRow} onPress={() => onChange(!value)}>
      <Text>{value ? '☑' : '☐'}</Text>
      <Text style={s.label}>{label}</Text>
    </Pressable>
  );
}

const initialSource: Array<'MANUAL' | 'ELECTRONIC'> = ['MANUAL', 'ELECTRONIC'];

export function CaseFilters({ values, onChange, onSearch, onClear }: CaseFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const setValue = <K extends keyof CaseSearchFilters>(key: K, value: CaseSearchFilters[K]) =>
    onChange({ ...values, [key]: value });

  return (
    <View style={s.panel}>
      <View style={s.titleRow}>
        <Text style={s.title}>{C.filtersTitle}</Text>
        <Pressable style={s.toggleButton} onPress={() => setIsExpanded((v) => !v)}>
          <Text style={s.toggleText}>{isExpanded ? C.filtersCollapse : C.filtersExpand}</Text>
        </Pressable>
      </View>
      {isExpanded && (
        <>
          <Field label={C.orgTypeLabel} value={values.orgTypeId ?? ''} onChangeText={(v) => setValue('orgTypeId', v)} />
          <Field label={C.orgLabel} value={values.organization ?? ''} onChangeText={(v) => setValue('organization', v)} />
          <Field label={C.appRegNoLabel} value={values.appRegNo ?? ''} onChangeText={(v) => setValue('appRegNo', v)} />
          <Field label={C.trTypeLabel} value={values.trTypeId ?? ''} onChangeText={(v) => setValue('trTypeId', v)} />
          <Field label={C.transferStatusLabel} value={values.transferStatusId ?? ''} onChangeText={(v) => setValue('transferStatusId', v)} />
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
            <TextInput style={[s.input, s.half]} value={values.regDateFrom ?? ''} onChangeText={(v) => setValue('regDateFrom', v)} placeholder="YYYY-MM-DD" />
            <TextInput style={[s.input, s.half]} value={values.regDateTo ?? ''} onChangeText={(v) => setValue('regDateTo', v)} placeholder="YYYY-MM-DD" />
          </View>
          <Text style={s.label}>{C.statusPeriodLabel}</Text>
          <View style={s.row}>
            <TextInput style={[s.input, s.half]} value={values.statusDateFrom ?? ''} onChangeText={(v) => setValue('statusDateFrom', v)} placeholder="YYYY-MM-DD" />
            <TextInput style={[s.input, s.half]} value={values.statusDateTo ?? ''} onChangeText={(v) => setValue('statusDateTo', v)} placeholder="YYYY-MM-DD" />
          </View>
          <Field label={C.participantTypeLabel} value={values.participantTypeId ?? ''} onChangeText={(v) => setValue('participantTypeId', v)} />
          <Field label={C.idNumberLabel} value={values.idnumber ?? ''} onChangeText={(v) => setValue('idnumber', v)} />
          <Field label={C.firstNameLabel} value={values.firstName ?? ''} onChangeText={(v) => setValue('firstName', v)} />
          <Field label={C.lastNameLabel} value={values.lastName ?? ''} onChangeText={(v) => setValue('lastName', v)} />
          <Field label={C.addressLabel} value={values.address ?? ''} onChangeText={(v) => setValue('address', v)} />
          <Field label={C.organizationNameLabel} value={values.organizationName ?? ''} onChangeText={(v) => setValue('organizationName', v)} />
          <Field label={C.paymentIdLabel} value={values.paymentIdentifier ?? ''} onChangeText={(v) => setValue('paymentIdentifier', v)} />
          <Field label={C.cadastralCodeLabel} value={values.cadastralCode ?? ''} onChangeText={(v) => setValue('cadastralCode', v)} />
          <Field label={C.vehicleNoLabel} value={values.vehicleNumber ?? ''} onChangeText={(v) => setValue('vehicleNumber', v)} />
          <Field label={C.postNoLabel} value={values.postNumber ?? ''} onChangeText={(v) => setValue('postNumber', v)} />
          <ToggleRow label={C.autoProcessLabel} value={values.automaticProcess} onChange={(v) => setValue('automaticProcess', v)} />
          <ToggleRow label={C.updateByDateLabel} value={values.updateByDate} onChange={(v) => setValue('updateByDate', v)} />
          <ToggleRow label={C.conditionalLabel} value={values.conditional} onChange={(v) => setValue('conditional', v)} />
          <ToggleRow label={C.immediateEnfLabel} value={values.immediateEnf} onChange={(v) => setValue('immediateEnf', v)} />
          <View style={s.actions}>
            <Pressable style={s.searchButton} onPress={onSearch}><Text style={s.searchText}>{C.searchButton}</Text></Pressable>
            <Pressable style={s.clearButton} onPress={onClear}><Text style={s.clearText}>{C.clearButton}</Text></Pressable>
          </View>
        </>
      )}
    </View>
  );
}
