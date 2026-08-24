import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, Text, View } from 'react-native';

import { Input } from '@/components/ui/input';

import { profileFaceIdSectionStyles as s } from './profile-face-id-section.styles';
import { profileScreenStyles as ps } from './profile-screen.styles';

type Props = {
  visible: boolean;
  isSubmitting: boolean;
  defaultLabel?: string;
  onConfirm: (label: string) => void;
  onClose: () => void;
};

/**
 * Asks for a friendly device label before minting the passkey. The label is
 * optional — leaving it blank falls back to the technical device name — so the
 * confirm button is never disabled on an empty field.
 */
export function ProfileDeviceTrustModal({
  visible,
  isSubmitting,
  defaultLabel = '',
  onConfirm,
  onClose,
}: Props) {
  const { t } = useTranslation();
  const [label, setLabel] = useState(defaultLabel);

  // Reset to the suggested label each time the modal opens.
  useEffect(() => {
    if (visible) setLabel(defaultLabel);
  }, [visible, defaultLabel]);

  function handleClose() {
    onClose();
  }

  function handleSubmit() {
    onConfirm(label);
  }

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={handleClose}>
      <View style={s.modalBackdrop}>
        <View style={s.modalCard}>
          <Text style={s.modalTitle}>{t('deviceTrust.labelTitle')}</Text>
          <Text style={s.modalDescription}>
            {t('deviceTrust.labelDescription')}
          </Text>
          <Input
            value={label}
            onChangeText={setLabel}
            placeholder={t('deviceTrust.labelPlaceholder')}
            autoCapitalize="sentences"
          />
          <View style={s.modalActions}>
            <Pressable
              style={[ps.buttonOutline, isSubmitting && ps.buttonDisabled]}
              onPress={handleClose}
              disabled={isSubmitting}
              accessibilityRole="button">
              <Text style={ps.buttonOutlineText}>{t('deviceTrust.cancelButton')}</Text>
            </Pressable>
            <Pressable
              style={[ps.buttonPrimary, isSubmitting && ps.buttonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              accessibilityRole="button">
              <Text style={ps.buttonPrimaryText}>{t('deviceTrust.confirmButton')}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
