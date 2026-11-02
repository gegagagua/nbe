import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';

import { ModalBackdrop } from '@/components/ui/modal-backdrop';
import { useAppTheme } from '@/theme';

export type ProfileAccountOption = {
  id: string;
  name: string;
};

type Props = {
  visible: boolean;
  accounts: ProfileAccountOption[];
  selectedId: string | null;
  isLoading?: boolean;
  onSelect: (account: ProfileAccountOption) => void;
  onClose: () => void;
};

export function ProfileAccountSwitchModal({
  visible,
  accounts,
  selectedId,
  isLoading = false,
  onSelect,
  onClose,
}: Props) {
  const { t } = useTranslation();
  const { colors, shadows } = useAppTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent>
      <ModalBackdrop
        onClose={onClose}
        style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: colors.overlay }}>
        <Animated.View
          entering={SlideInDown.duration(250)}
          className="gap-3 rounded-t-3xl bg-surface px-4 pb-16 pt-2"
          style={shadows.lg}>
          <View className="h-1 w-10 self-center rounded-full bg-border" />
          <Text className="text-subtitle font-bold text-fg">{t('profile.switchAccountTitle')}</Text>

          {isLoading ? (
            <ActivityIndicator className="py-4" size="large" color={colors.primary} />
          ) : accounts.length === 0 ? (
            <Text className="py-4 text-center text-body text-fg-muted">
              {t('profile.switchAccountEmpty')}
            </Text>
          ) : (
            <ScrollView className="max-h-[360px]" showsVerticalScrollIndicator={false}>
              {accounts.map((account) => {
                const selected = account.id === selectedId;
                return (
                  <Pressable
                    key={account.id}
                    className="flex-row items-center gap-3 py-3 active:opacity-70"
                    onPress={() => onSelect(account)}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selected }}>
                    <View
                      className={`h-[22px] w-[22px] items-center justify-center rounded-full border-2 ${
                        selected ? 'border-primary' : 'border-fg-muted'
                      }`}>
                      {selected ? (
                        <View className="h-[10px] w-[10px] rounded-full bg-primary" />
                      ) : null}
                    </View>
                    <Text className="flex-1 text-body font-semibold uppercase text-fg" numberOfLines={2}>
                      {account.name}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}
        </Animated.View>
      </ModalBackdrop>
    </Modal>
  );
}
