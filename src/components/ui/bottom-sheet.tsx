import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppTheme } from '@/theme';

export type AppBottomSheetProps = {
  children: React.ReactNode;
  /** Optional title shown at the top of the sheet. */
  title?: string;
  /** Fixed snap points (e.g. ['50%','90%']). Omit for dynamic sizing. */
  snapPoints?: (string | number)[];
  onDismiss?: () => void;
};

export type AppBottomSheetRef = {
  present: () => void;
  dismiss: () => void;
};

/**
 * Themed bottom sheet (replaces modals). Built on @gorhom/bottom-sheet, which
 * runs its gestures + transitions on the UI thread via reanimated +
 * gesture-handler. Requires BottomSheetModalProvider at the app root.
 */
export const AppBottomSheet = forwardRef<AppBottomSheetRef, AppBottomSheetProps>(
  function AppBottomSheet({ children, title, snapPoints, onDismiss }, ref) {
    const { colors, isDark } = useAppTheme();
    const insets = useSafeAreaInsets();
    const modalRef = useRef<BottomSheetModal>(null);

    useImperativeHandle(ref, () => ({
      present: () => modalRef.current?.present(),
      dismiss: () => modalRef.current?.dismiss(),
    }));

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} opacity={0.5} />
      ),
      [],
    );

    return (
      <BottomSheetModal
        ref={modalRef}
        snapPoints={snapPoints}
        enableDynamicSizing={!snapPoints}
        onDismiss={onDismiss}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: colors.borderStrong }}
        backgroundStyle={{ backgroundColor: colors.surfaceElevated, borderRadius: 28 }}
        enableOverDrag
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore">
        <BottomSheetView style={{ paddingBottom: insets.bottom + 16 }}>
          <View className="px-5 pt-1">
            {title ? <Text className="mb-3 text-title font-bold text-fg">{title}</Text> : null}
            {children}
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);
