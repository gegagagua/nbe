import { Pressable, Text, View } from 'react-native';

type Props = {
  searchLabel: string;
  clearLabel: string;
  onSearch: () => void;
  onClear: () => void;
  searchDisabled?: boolean;
};

/** The search + square clear button pair used by the cases and debtor-registry
 *  filter panels. */
export function SearchActions({
  searchLabel,
  clearLabel,
  onSearch,
  onClear,
  searchDisabled = false,
}: Props) {
  return (
    <View className="flex-row items-center gap-2 mt-1">
      <Pressable
        className={[
          'flex-1 h-[50px] rounded-md bg-primary items-center justify-center',
          searchDisabled ? 'opacity-50' : '',
        ].join(' ')}
        onPress={onSearch}
        disabled={searchDisabled}
        accessibilityRole="button">
        <Text className="text-on-primary font-bold">{searchLabel}</Text>
      </Pressable>
      <Pressable
        className="w-[50px] h-[50px] rounded-md border border-input-border bg-input items-center justify-center"
        onPress={onClear}
        accessibilityRole="button">
        <Text className="text-fg font-bold">{clearLabel}</Text>
      </Pressable>
    </View>
  );
}
