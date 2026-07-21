import { Pressable, Text, View } from 'react-native';

import { searchActionsStyles as s } from './search-actions.styles';

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
    <View style={s.actions}>
      <Pressable
        style={[s.searchButton, searchDisabled && s.searchButtonDisabled]}
        onPress={onSearch}
        disabled={searchDisabled}
        accessibilityRole="button">
        <Text style={s.searchText}>{searchLabel}</Text>
      </Pressable>
      <Pressable style={s.clearButton} onPress={onClear} accessibilityRole="button">
        <Text style={s.clearText}>{clearLabel}</Text>
      </Pressable>
    </View>
  );
}
