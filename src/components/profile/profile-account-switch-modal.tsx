import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';

import { ModalBackdrop } from '@/components/ui/modal-backdrop';
import { LoginPalette } from '@/constants/login';

import { profileAccountSwitchModalStyles as s } from './profile-account-switch-modal.styles';

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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent>
      <ModalBackdrop onClose={onClose} style={s.overlay}>
        <Animated.View entering={SlideInDown.duration(250)} style={s.sheet}>
          <View style={s.handle} />
          <Text style={s.title}>{t('profile.switchAccountTitle')}</Text>

          {isLoading ? (
            <ActivityIndicator style={s.loader} size="large" color={LoginPalette.primary} />
          ) : accounts.length === 0 ? (
            <Text style={s.emptyText}>{t('profile.switchAccountEmpty')}</Text>
          ) : (
            <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
              {accounts.map((account) => {
                const selected = account.id === selectedId;
                return (
                  <Pressable
                    key={account.id}
                    style={({ pressed }) => [s.row, pressed && s.rowPressed]}
                    onPress={() => onSelect(account)}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selected }}>
                    <View style={[s.radio, selected && s.radioSelected]}>
                      {selected ? <View style={s.radioDot} /> : null}
                    </View>
                    <Text style={s.rowText} numberOfLines={2}>
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
