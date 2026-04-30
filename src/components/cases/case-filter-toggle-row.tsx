import { Pressable, Text } from 'react-native';

import { caseFiltersStyles as s } from './case-filters.styles';

export function CaseFilterToggleRow({
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
