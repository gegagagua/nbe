import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, Text, TextInput, View } from 'react-native';

import { ModalBackdrop } from '@/components/ui/modal-backdrop';
import { LoginPalette } from '@/constants/login';

import { debtorAppEditModalStyles as s } from './debtor-app-edit-modal.styles';

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
      <ModalBackdrop onClose={onClose} style={s.overlay}>
        <View style={s.sheet}>
          <Text style={s.title}>{t('debtors.detailEditModalTitle')}</Text>

          <View style={s.fieldGap}>
            <Text style={s.label}>{t('debtors.extractSubjectNameLabel')}</Text>
            <TextInput
              value={draftName}
              onChangeText={setDraftName}
              placeholder={t('debtors.extractSubjectNamePlaceholder')}
              placeholderTextColor={LoginPalette.placeholderMuted}
              style={s.input}
            />
          </View>

          <View style={s.fieldGap}>
            <Text style={s.label}>{t('debtors.extractSubjectIdLabel')}</Text>
            <TextInput
              value={draftId}
              onChangeText={(v) => {
                setDraftId(v.replace(/\D/g, ''));
                if (idError) setIdError(false);
              }}
              keyboardType="number-pad"
              maxLength={11}
              placeholder={t('debtors.extractSubjectIdPlaceholder')}
              placeholderTextColor={LoginPalette.placeholderMuted}
              style={[s.input, idError && s.inputError]}
            />
            {idError ? (
              <Text style={s.errorText}>{t('debtors.detailEditIdError')}</Text>
            ) : null}
          </View>

          <View style={s.actions}>
            <Pressable
              style={[s.btn, s.cancelBtn]}
              onPress={onClose}
              disabled={saving}
              accessibilityRole="button">
              <Text style={s.cancelLabel}>{t('debtors.detailEditCancel')}</Text>
            </Pressable>
            <Pressable
              style={[s.btn, s.saveBtn, saving && s.btnDisabled]}
              accessibilityRole="button"
              disabled={saving}
              onPress={handleSave}>
              <Text style={s.saveLabel}>{t('debtors.detailEditSave')}</Text>
            </Pressable>
          </View>
        </View>
      </ModalBackdrop>
    </Modal>
  );
}
