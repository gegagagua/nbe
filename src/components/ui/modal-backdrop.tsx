import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

type Props = {
  onClose: () => void;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
};

export function ModalBackdrop({ onClose, style, children }: Props) {
  return (
    <View style={style}>
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close"
      />
      {children}
    </View>
  );
}
