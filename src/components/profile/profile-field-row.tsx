import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

type Props = {
  label: string;
  editing: boolean;
  displayValue: string;
  children: ReactNode;
};

export function ProfileFieldRow({ label, editing, displayValue, children }: Props) {
  return (
    <View className="gap-1.5">
      <Text className="text-label font-semibold uppercase tracking-wide text-fg-muted">{label}</Text>
      {editing ? (
        children
      ) : (
        <Text className="rounded-md bg-surface-sunken px-3 py-2 text-body text-fg">
          {displayValue || '—'}
        </Text>
      )}
    </View>
  );
}
