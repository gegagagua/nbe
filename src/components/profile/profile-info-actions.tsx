import { Pressable, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { profileScreenStyles as s } from './profile-screen.styles';

type Props = {
  editing: boolean;
  canEdit: boolean;
  isSaving: boolean;
  isValid: boolean;
  statusMessage: { type: 'success' | 'error'; text: string } | null;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
};

export function ProfileInfoActions({
  editing,
  canEdit,
  isSaving,
  isValid,
  statusMessage,
  onEdit,
  onCancel,
  onSave,
}: Props) {
  const { t } = useTranslation();

  return (
    <>
      {statusMessage ? (
        <Text
          style={[
            s.statusMessage,
            statusMessage.type === 'success' ? s.statusSuccess : s.statusError,
          ]}>
          {statusMessage.text}
        </Text>
      ) : null}

      {editing ? (
        <View style={s.rowButtons}>
          <Pressable
            style={[s.buttonOutline, isSaving && s.buttonDisabled]}
            onPress={onCancel}
            disabled={isSaving}
            accessibilityRole="button">
            <Text style={s.buttonOutlineText}>{t('profile.cancelButton')}</Text>
          </Pressable>
          <Pressable
            style={[s.buttonPrimary, (isSaving || !isValid) && s.buttonDisabled]}
            onPress={onSave}
            disabled={isSaving || !isValid}
            accessibilityRole="button">
            <Text style={s.buttonPrimaryText}>{t('profile.saveButton')}</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable
          style={[s.buttonOutline, !canEdit && s.buttonDisabled]}
          onPress={onEdit}
          disabled={!canEdit}
          accessibilityRole="button">
          <Text style={s.buttonOutlineText}>{t('profile.editButton')}</Text>
        </Pressable>
      )}
    </>
  );
}
