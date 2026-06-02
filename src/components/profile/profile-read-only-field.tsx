import { Text, View } from 'react-native';

import { profileScreenStyles as s } from './profile-screen.styles';

type Props = {
  label: string;
  value: string | null | undefined;
};

export function ProfileReadOnlyField({ label, value }: Props) {
  return (
    <View style={s.fieldRow}>
      <Text style={s.label}>{label}</Text>
      <Text style={[s.valueText, s.valueDisabled]}>{value?.trim() || '—'}</Text>
    </View>
  );
}
