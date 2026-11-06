import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppTheme } from '@/theme';

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
  const { colors } = useAppTheme();
  const [password, setPassword] = useState('');

  // Drop the typed password whenever the modal is dismissed so it never
  // lingers in state for the next open.
  useEffect(() => {
    if (!visible) setPassword('');
  }, [visible]);

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
      <View className="flex-1 justify-center px-5" style={{ backgroundColor: colors.overlay }}>
        <View className="gap-3 rounded-xl bg-surface p-5">
          <Text className="text-heading font-bold text-fg">{t('faceId.enablePasswordTitle')}</Text>
          <Text className="text-label leading-[18px] text-fg-secondary">
            {t('faceId.enablePasswordDescription')}
          </Text>
          <Input
            value={password}
            onChangeText={setPassword}
            placeholder={t('faceId.enablePasswordPlaceholder')}
            secureTextEntry
            errorMessage={errorMessage ?? undefined}
          />
          {errorMessage ? <Text className="text-label text-danger">{errorMessage}</Text> : null}
          <View className="flex-row gap-2">
            <View className="flex-1">
              <Button
                label={t('faceId.cancelButton')}
                onPress={handleClose}
                disabled={isSubmitting}
                variant="secondary"
              />
            </View>
            <View className="flex-1">
              <Button
                label={t('faceId.enableConfirmButton')}
                onPress={handleSubmit}
                disabled={isSubmitting || !password}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
