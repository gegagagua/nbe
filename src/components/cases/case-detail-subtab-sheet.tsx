import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import type { CaseDetailInfoSub } from '@/types/case-detail-ui';

type Opt = { key: CaseDetailInfoSub; label: string };

type Props = {
  visible: boolean;
  options: Opt[];
  onClose: () => void;
  onSelect: (key: CaseDetailInfoSub) => void;
};

export function CaseDetailSubtabSheet({ visible, options, onClose, onSelect }: Props) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/40">
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityRole="button" />
        <View className="flex-1 px-4 pt-32">
          <View className="mb-4 overflow-hidden rounded-md border border-border bg-surface">
            {options.map((o) => (
              <Pressable
                key={o.key}
                className="flex-row items-center justify-between border-b border-border p-2"
                onPress={() => {
                  onSelect(o.key);
                  onClose();
                }}>
                <Text className="text-label font-bold text-fg">{o.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}
