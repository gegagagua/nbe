import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useAppTheme } from '@/theme';

type Props = {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
};

export function CaseDetailAgencyAccordion({ title, open, onToggle, children }: Props) {
  const { colors } = useAppTheme();
  return (
    <View className="mb-4 overflow-hidden rounded-md border border-border bg-surface">
      <Pressable
        className="flex-row items-center justify-between border-b border-border p-2"
        onPress={onToggle}>
        <Text className="text-label font-bold text-fg">{title}</Text>
        <MaterialCommunityIcons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={22}
          color={colors.primary}
        />
      </Pressable>
      {open ? <View>{children}</View> : null}
    </View>
  );
}
