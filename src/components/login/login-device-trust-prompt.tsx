import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, Text, View } from 'react-native';

import { LoginPalette } from '@/constants/login';

import { profileFaceIdSectionStyles as s } from '../profile/profile-face-id-section.styles';
import { profileScreenStyles as ps } from '../profile/profile-screen.styles';

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

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}>
      <View style={s.modalBackdrop}>
        <View style={s.modalCard}>
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>{t('deviceTrust.promptTitle')}</Text>
            <Pressable
              style={s.modalClose}
              onPress={onClose}
              disabled={isSubmitting}
              accessibilityRole="button"
              accessibilityLabel={t('deviceTrust.cancelButton')}>
              <MaterialCommunityIcons
                name="close"
                size={22}
                color={LoginPalette.titleText}
              />
            </Pressable>
          </View>
          <Text style={s.modalDescription}>
            {t('deviceTrust.promptQuestion')}
          </Text>
          <Text style={s.modalDescription}>
            {t('deviceTrust.promptDescription')}
          </Text>
          <View style={s.modalActions}>
            <Pressable
              style={[ps.buttonOutline, isSubmitting && ps.buttonDisabled]}
              onPress={onClose}
              disabled={isSubmitting}
              accessibilityRole="button">
              <Text style={ps.buttonOutlineText}>{t('deviceTrust.promptNo')}</Text>
            </Pressable>
            <Pressable
              style={[ps.buttonPrimary, isSubmitting && ps.buttonDisabled]}
              onPress={onConfirm}
              disabled={isSubmitting}
              accessibilityRole="button">
              <Text style={ps.buttonPrimaryText}>{t('deviceTrust.promptYes')}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
