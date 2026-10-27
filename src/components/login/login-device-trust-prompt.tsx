import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { useAppTheme } from '@/theme';

type Props = {
  visible: boolean;
  isSubmitting: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

/**
 * Post-login "trust this device?" prompt (NM-317). The technical spec asks for a
 * simple Yes/No confirmation with an X to dismiss — NOT the device-name input the
 * profile screen uses. Answering "yes" mints the passkey; the OS biometric / PIN
 * sheet that follows is what enforces the Face ID / fingerprint / PIN requirement.
 * Answering "no" (or X) keeps standard password auth on every sign-in.
 */
export function LoginDeviceTrustPrompt({
  visible,
  isSubmitting,
  onConfirm,
  onClose,
}: Props) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}>
      <View className="flex-1 justify-center px-5" style={{ backgroundColor: colors.overlay }}>
        <View className="gap-3 rounded-xl bg-surface p-5">
          <View className="flex-row items-start justify-between gap-2">
            <Text className="text-heading font-bold text-fg">{t('deviceTrust.promptTitle')}</Text>
            <Pressable
              className="-mr-1 -mt-1 p-1"
              onPress={onClose}
              disabled={isSubmitting}
              accessibilityRole="button"
              accessibilityLabel={t('deviceTrust.cancelButton')}>
              <MaterialCommunityIcons name="close" size={22} color={colors.text} />
            </Pressable>
          </View>
          <Text className="text-label leading-[18px] text-fg-secondary">
            {t('deviceTrust.promptQuestion')}
          </Text>
          <Text className="text-label leading-[18px] text-fg-secondary">
            {t('deviceTrust.promptDescription')}
          </Text>
          <View className="flex-row gap-2">
            <View className="flex-1">
              <Button
                label={t('deviceTrust.promptNo')}
                onPress={onClose}
                disabled={isSubmitting}
                variant="secondary"
              />
            </View>
            <View className="flex-1">
              <Button
                label={t('deviceTrust.promptYes')}
                onPress={onConfirm}
                disabled={isSubmitting}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
