import { Text, View } from 'react-native';

type Props = {
  label: string;
  value: string | null | undefined;
};

export function ProfileReadOnlyField({ label, value }: Props) {
  return (
    <View className="gap-1.5">
      <Text className="text-label font-semibold uppercase tracking-wide text-fg-muted">{label}</Text>
      <Text className="rounded-md bg-surface-sunken px-3 py-2 text-body text-fg-secondary">
        {value?.trim() || '—'}
      </Text>
    </View>
  );
}
