import { Text, TextInput } from 'react-native';

import { caseFiltersStyles as s } from './case-filters.styles';

export function CaseFilterField({
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
      <TextInput
        style={s.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
      />
    </>
  );
}
