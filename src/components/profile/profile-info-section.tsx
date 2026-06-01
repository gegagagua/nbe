import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import { Input } from '@/components/ui/input';
import {
  createProfileInfoEditSchema,
  type ProfileInfoEditValues,
} from '@/schemas/profile-info-edit.schema';
import type { SessionUserProfileBrief } from '@/types/session';

import { profileScreenStyles as s } from './profile-screen.styles';

type Props = {
  profile: SessionUserProfileBrief;
  idnumber?: string | null;
  address: string;
  canEdit?: boolean;
  onSave: (values: ProfileInfoEditValues) => Promise<void>;
  isSaving: boolean;
  statusMessage: { type: 'success' | 'error'; text: string } | null;
};

function toFormValues(profile: SessionUserProfileBrief, address: string): ProfileInfoEditValues {
  return { firstName: profile.firstName, lastName: profile.lastName, address };
}

export function ProfileInfoSection({
  profile,
  idnumber,
  address,
  canEdit = true,
  onSave,
  isSaving,
  statusMessage,
}: Props) {
  const { t, i18n } = useTranslation();
  const [editing, setEditing] = useState(false);
  const schema = useMemo(() => createProfileInfoEditSchema(t), [t, i18n.language]);

  const { control, handleSubmit, formState, reset } = useForm<ProfileInfoEditValues>({
    resolver: zodResolver(schema),
    defaultValues: toFormValues(profile, address),
  });

  useEffect(() => {
    reset(toFormValues(profile, address));
  }, [profile.firstName, profile.lastName, address, reset]);

  function handleCancel() {
    reset(toFormValues(profile, address));
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
        </View>

        {idnumber ? (
          <View style={s.fieldRow}>
            <Text style={s.label}>{t('profile.labelPersonalId')}</Text>
            <Text style={[s.valueText, s.valueDisabled]}>{idnumber}</Text>
          </View>
        ) : null}

        {canEdit ? (
          <View style={s.fieldRow}>
            <Text style={s.label}>{t('profile.labelAddress')}</Text>
            {editing ? (
              <Controller
                control={control}
                name="address"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder={t('profile.labelAddress')}
                    errorMessage={formState.errors.address?.message}
                  />
                )}
              />
            ) : (
              <Text style={s.valueText}>{address || '—'}</Text>
            )}
          </View>
        ) : null}
      </View>

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
        <Pressable
          style={[s.buttonOutline, !canEdit && s.buttonDisabled]}
          onPress={() => setEditing(true)}
          disabled={!canEdit}
          accessibilityRole="button">
          <Text style={s.buttonOutlineText}>{t('profile.editButton')}</Text>
        </Pressable>
      )}
    </View>
  );
}
