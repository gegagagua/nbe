import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { profileScreenStyles as s } from './profile-screen.styles';

type Props = {
  label: string;
  editing: boolean;
  displayValue: string;
  children: ReactNode;
};

export function ProfileFieldRow({ label, editing, displayValue, children }: Props) {
  return (
    <View style={s.fieldRow}>
      <Text style={s.label}>{label}</Text>
      {editing ? children : <Text style={s.valueText}>{displayValue || '—'}</Text>}
    </View>
  );
}
