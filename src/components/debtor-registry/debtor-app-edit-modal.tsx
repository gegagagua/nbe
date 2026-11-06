import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ModalBackdrop } from '@/components/ui/modal-backdrop';
import { useAppTheme } from '@/theme';

type Props = {
  visible: boolean;
  name: string;
  idnumber: string;
  saving?: boolean;
  onClose: () => void;
  onSave: (next: { name: string; idnumber: string }) => void;
};

export function DebtorAppEditModal({
  visible,
  name,
  idnumber,
  saving = false,
  onClose,
  onSave,
}: Props) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const [draftName, setDraftName] = useState(name);
  const [draftId, setDraftId] = useState(idnumber);
  const [idError, setIdError] = useState(false);

  // Reseed the draft each time the modal opens so it reflects current values.
  useEffect(() => {
    if (visible) {
      setDraftName(name);
      setDraftId(idnumber);
      setIdError(false);
    }
  }, [visible, name, idnumber]);

  // Personal ID number is 11 digits; organization identification code is 9.
  const isIdValid = (value: string) => /^\d{9}$|^\d{11}$/.test(value);

  const handleSave = () => {
    const trimmedId = draftId.trim();
    if (!isIdValid(trimmedId)) {
      setIdError(true);
      return;
    }
    onSave({ name: draftName.trim(), idnumber: trimmedId });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent>
      <ModalBackdrop
        onClose={onClose}
        style={{
          flex: 1,
          backgroundColor: colors.overlay,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
        }}>
        <View className="w-full max-w-[480px] gap-4 rounded-lg bg-surface p-5">
          <Text className="text-center text-title font-bold text-fg">
            {t('debtors.detailEditModalTitle')}
          </Text>

          <Input
            label={t('debtors.extractSubjectNameLabel')}
            required
            placeholder=""
            value={draftName}
            onChangeText={setDraftName}
          />

          <Input
            label={t('debtors.extractSubjectIdLabel')}
            required
            placeholder=""
            value={draftId}
            onChangeText={(v) => {
              setDraftId(v.replace(/\D/g, ''));
              if (idError) setIdError(false);
            }}
            keyboardType="number-pad"
            maxLength={11}
            errorMessage={idError ? t('debtors.detailEditIdError') : undefined}
          />

          <View className="mt-1 flex-row gap-2">
            <View className="flex-1">
              <Button
                label={t('debtors.detailEditCancel')}
                variant="secondary"
                disabled={saving}
                onPress={onClose}
              />
            </View>
            <View className="flex-1">
              <Button
                label={t('debtors.detailEditSave')}
                loading={saving}
                disabled={saving}
                onPress={handleSave}
              />
            </View>
          </View>
        </View>
      </ModalBackdrop>
    </Modal>
  );
}
