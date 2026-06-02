import type { Control, FormState } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Input } from '@/components/ui/input';
import type { ProfileInfoEditValues } from '@/schemas/profile-info-edit.schema';

import { ProfileFieldRow } from './profile-field-row';

type Props = {
  editing: boolean;
  canEdit: boolean;
  control: Control<ProfileInfoEditValues>;
  formState: FormState<ProfileInfoEditValues>;
  phone: string | null | undefined;
  email: string | null | undefined;
  realAddress: string;
  legalAddress: string;
};

export function ProfileInfoEditableFields({
  editing,
  canEdit,
  control,
  formState,
  phone,
  email,
  realAddress,
  legalAddress,
}: Props) {
  const { t } = useTranslation();

  if (!canEdit) return null;

  return (
    <>
      <ProfileFieldRow label={t('profile.labelPhone')} editing={editing} displayValue={phone ?? ''}>
        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('profile.labelPhone')}
              keyboardType="phone-pad"
              errorMessage={formState.errors.phone?.message}
            />
          )}
        />
      </ProfileFieldRow>

      <ProfileFieldRow label={t('profile.labelEmail')} editing={editing} displayValue={email ?? ''}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('profile.labelEmail')}
              keyboardType="email-address"
              autoCapitalize="none"
              errorMessage={formState.errors.email?.message}
            />
          )}
        />
      </ProfileFieldRow>

      <ProfileFieldRow
        label={t('profile.labelRealAddress')}
        editing={editing}
        displayValue={realAddress}>
        <Controller
          control={control}
          name="realAddress"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('profile.labelRealAddress')}
              errorMessage={formState.errors.realAddress?.message}
            />
          )}
        />
      </ProfileFieldRow>

      <ProfileFieldRow
        label={t('profile.labelLegalAddress')}
        editing={editing}
        displayValue={legalAddress}>
        <Controller
          control={control}
          name="legalAddress"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder={t('profile.labelLegalAddress')}
              errorMessage={formState.errors.legalAddress?.message}
            />
          )}
        />
      </ProfileFieldRow>
    </>
  );
}
