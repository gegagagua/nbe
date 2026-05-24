import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { z } from 'zod';

import { Input } from '@/components/ui/input';
import type { SessionUserProfileBrief } from '@/types/session';

import { profileScreenStyles as s } from './profile-screen.styles';

type EditValues = { firstName: string; lastName: string };

type Props = {
  profile: SessionUserProfileBrief;
  onSave: (values: EditValues) => Promise<void>;
  isSaving: boolean;
  statusMessage: { type: 'success' | 'error'; text: string } | null;
};

function createEditSchema(t: ReturnType<typeof useTranslation>['t']) {
  return z.object({
    firstName: z.string().trim().min(1, t('validation.requiredFirstName')),
    lastName: z.string().trim().min(1, t('validation.requiredLastName')),
  });
}

export function ProfileInfoSection({ profile, onSave, isSaving, statusMessage }: Props) {
  const { t, i18n } = useTranslation();
  const [editing, setEditing] = useState(false);
  const schema = useMemo(() => createEditSchema(t), [t, i18n.language]);

  const { control, handleSubmit, formState, reset } = useForm<EditValues>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: profile.firstName, lastName: profile.lastName },
  });

  function handleCancel() {
    reset({ firstName: profile.firstName, lastName: profile.lastName });
    setEditing(false);
  }

  const onSubmit = handleSubmit(async (values) => {
    await onSave(values);
    setEditing(false);
  });

  return (
    <View style={s.card}>
      <Text style={s.sectionTitle}>{t('profile.sectionInfo')}</Text>

      <View style={s.fieldGroup}>
        <View style={s.fieldRow}>
          <Text style={s.label}>{t('profile.labelFirstName')}</Text>
          {editing ? (
            <Controller
              control={control}
              name="firstName"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder={t('profile.labelFirstName')}
                  errorMessage={formState.errors.firstName?.message}
                />
              )}
            />
          ) : (
            <Text style={s.valueText}>{profile.firstName}</Text>
          )}
          {editing && formState.errors.firstName?.message ? (
            <Text style={s.fieldError}>{formState.errors.firstName.message}</Text>
          ) : null}
        </View>

        <View style={s.fieldRow}>
          <Text style={s.label}>{t('profile.labelLastName')}</Text>
          {editing ? (
            <Controller
              control={control}
              name="lastName"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder={t('profile.labelLastName')}
                  errorMessage={formState.errors.lastName?.message}
                />
              )}
            />
          ) : (
            <Text style={s.valueText}>{profile.lastName}</Text>
          )}
          {editing && formState.errors.lastName?.message ? (
            <Text style={s.fieldError}>{formState.errors.lastName.message}</Text>
          ) : null}
        </View>
      </View>

      {statusMessage ? (
        <Text style={[s.statusMessage, statusMessage.type === 'success' ? s.statusSuccess : s.statusError]}>
          {statusMessage.text}
        </Text>
      ) : null}

      {editing ? (
        <View style={s.rowButtons}>
          <Pressable
            style={[s.buttonOutline, isSaving && s.buttonDisabled]}
            onPress={handleCancel}
            disabled={isSaving}
            accessibilityRole="button">
            <Text style={s.buttonOutlineText}>{t('profile.cancelButton')}</Text>
          </Pressable>
          <Pressable
            style={[s.buttonPrimary, (isSaving || !formState.isValid) && s.buttonDisabled]}
            onPress={() => void onSubmit()}
            disabled={isSaving || !formState.isValid}
            accessibilityRole="button">
            <Text style={s.buttonPrimaryText}>{t('profile.saveButton')}</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable style={s.buttonOutline} onPress={() => setEditing(true)} accessibilityRole="button">
          <Text style={s.buttonOutlineText}>{t('profile.editButton')}</Text>
        </Pressable>
      )}
    </View>
  );
}
