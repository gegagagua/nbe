import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, Text, View } from 'react-native';

import { Input } from '@/components/ui/input';

import { profileFaceIdSectionStyles as s } from './profile-face-id-section.styles';
import { profileScreenStyles as ps } from './profile-screen.styles';

type Props = {
  visible: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  onConfirm: (password: string) => void;
  onClose: () => void;
};

export function ProfileFaceIdEnableModal({
  visible,
  isSubmitting,
  errorMessage,
  onConfirm,
  onClose,
}: Props) {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');

  function handleClose() {
    setPassword('');
    onClose();
  }

  function handleSubmit() {
    if (!password) return;
    onConfirm(password);
  }

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={handleClose}>
      <View style={s.modalBackdrop}>
        <View style={s.modalCard}>
          <Text style={s.modalTitle}>{t('faceId.enablePasswordTitle')}</Text>
          <Text style={s.modalDescription}>
            {t('faceId.enablePasswordDescription')}
          </Text>
          <Input
            value={password}
            onChangeText={setPassword}
            placeholder={t('faceId.enablePasswordPlaceholder')}
            secureTextEntry
            errorMessage={errorMessage ?? undefined}
          />
          {errorMessage ? <Text style={s.fieldError}>{errorMessage}</Text> : null}
          <View style={s.modalActions}>
            <Pressable
              style={[ps.buttonOutline, isSubmitting && ps.buttonDisabled]}
              onPress={handleClose}
              disabled={isSubmitting}
              accessibilityRole="button">
              <Text style={ps.buttonOutlineText}>{t('faceId.cancelButton')}</Text>
            </Pressable>
            <Pressable
              style={[ps.buttonPrimary, (isSubmitting || !password) && ps.buttonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting || !password}
              accessibilityRole="button">
              <Text style={ps.buttonPrimaryText}>{t('faceId.enableConfirmButton')}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
