import { Pressable, Text } from 'react-native';

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
    <Pressable className="flex-row items-center gap-1" onPress={() => onChange(!value)}>
      <Text>{value ? '☑' : '☐'}</Text>
      <Text className="text-label font-semibold text-fg">{label}</Text>
    </Pressable>
  );
}
