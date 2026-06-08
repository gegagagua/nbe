import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { formatGeorgianPhoneForInput } from '@/lib/phone';
import {
  createProfileInfoEditSchema,
  type ProfileInfoEditValues,
} from '@/schemas/profile-info-edit.schema';
import { ProfileInfoActions } from './profile-info-actions';
import { ProfileInfoEditableFields } from './profile-info-editable-fields';
import { ProfileReadOnlyField } from './profile-read-only-field';
import { profileScreenStyles as s } from './profile-screen.styles';

type Props = {
  firstName: string | null;
  lastName: string | null;
  idnumber?: string | null;
  phone?: string | null;
  email?: string | null;
  realAddress: string;
  legalAddress: string;
  canEdit?: boolean;
  onSave: (values: ProfileInfoEditValues) => Promise<void>;
  isSaving: boolean;
  statusMessage: { type: 'success' | 'error'; text: string } | null;
};

function toFormValues(
  phone: string | null | undefined,
  email: string | null | undefined,
  realAddress: string,
  legalAddress: string,
): ProfileInfoEditValues {
  return {
    phone: formatGeorgianPhoneForInput(phone),
    email: email?.trim() ?? '',
    realAddress,
    legalAddress,
  };
}

export function ProfileInfoSection({
  firstName,
  lastName,
  idnumber,
  phone,
  email,
  realAddress,
  legalAddress,
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
    defaultValues: toFormValues(phone, email, realAddress, legalAddress),
  });

  useEffect(() => {
    reset(toFormValues(phone, email, realAddress, legalAddress));
  }, [phone, email, realAddress, legalAddress, reset]);

  function handleCancel() {
    reset(toFormValues(phone, email, realAddress, legalAddress));
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
        <ProfileReadOnlyField label={t('profile.labelFirstName')} value={firstName ?? ''} />
        <ProfileReadOnlyField label={t('profile.labelLastName')} value={lastName ?? ''} />
        {idnumber ? (
          <ProfileReadOnlyField label={t('profile.labelPersonalId')} value={idnumber} />
        ) : null}

        <ProfileInfoEditableFields
          editing={editing}
          canEdit={canEdit}
          control={control}
          formState={formState}
          phone={phone}
          email={email}
          realAddress={realAddress}
          legalAddress={legalAddress}
        />
      </View>

      <ProfileInfoActions
        editing={editing}
        canEdit={canEdit}
        isSaving={isSaving}
        isValid={formState.isValid}
        statusMessage={statusMessage}
        onEdit={() => setEditing(true)}
        onCancel={handleCancel}
        onSave={() => void onSubmit()}
      />
    </View>
  );
}
