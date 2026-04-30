import { Input } from '@/components/ui/input';
import type { InputProps } from '@/types/input';

export function CaseFilterField({
  placeholder,
  value,
  onChangeText,
  keyboardType,
}: {
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  keyboardType?: InputProps['keyboardType'];
}) {
  return (
    <Input
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      keyboardType={keyboardType}
    />
  );
}
