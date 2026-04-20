import type { PropsWithChildren } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Edge } from 'react-native-safe-area-context';

export function AppSafeArea({
  children,
  style,
  edges = ['top'],
}: PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  edges?: readonly Edge[];
}>) {
  return (
    <SafeAreaView style={style} edges={edges}>
      {children}
    </SafeAreaView>
  );
}
