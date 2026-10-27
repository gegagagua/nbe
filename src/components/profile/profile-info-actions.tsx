import { Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';

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
    <View className="gap-3">
      {statusMessage ? (
        <Text
          className={`text-center text-caption font-semibold ${
            statusMessage.type === 'success' ? 'text-success' : 'text-danger'
          }`}>
          {statusMessage.text}
        </Text>
      ) : null}

      {editing ? (
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Button
              label={t('profile.cancelButton')}
              onPress={onCancel}
              disabled={isSaving}
              variant="secondary"
              size="sm"
            />
          </View>
          <View className="flex-1">
            <Button
              label={t('profile.saveButton')}
              onPress={onSave}
              disabled={isSaving || !isValid}
              loading={isSaving}
              size="sm"
            />
          </View>
        </View>
      ) : (
        <Button
          label={t('profile.editButton')}
          onPress={onEdit}
          disabled={!canEdit}
          variant="secondary"
        />
      )}
    </View>
  );
}
