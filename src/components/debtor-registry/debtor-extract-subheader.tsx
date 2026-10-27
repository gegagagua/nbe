import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '@/theme';

type Props = {
  title: string;
  backA11y: string;
  onBack: () => void;
};

export function DebtorExtractSubheader({ title, backA11y, onBack }: Props) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  return (
    <View
      className="flex-row items-center gap-2 border-b border-border bg-surface px-4 pb-3"
      style={{ paddingTop: insets.top + 8 }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={backA11y}
        onPress={onBack}
        className="-ml-2 p-2"
      >
        <MaterialCommunityIcons name="chevron-left" size={28} color={colors.text} />
      </Pressable>
      <Text className="flex-1 text-title font-bold text-fg">{title}</Text>
    </View>
  );
}
