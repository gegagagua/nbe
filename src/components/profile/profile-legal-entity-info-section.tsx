import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

import type { LegalEntity } from '@/types/users';

import { ProfileReadOnlyField } from './profile-read-only-field';
import { profileScreenStyles as s } from './profile-screen.styles';

type Props = {
  entity: LegalEntity;
  onEdit: () => void;
};

export function ProfileLegalEntityInfoSection({ entity, onEdit }: Props) {
  const { t } = useTranslation();

  return (
    <View style={s.card}>
      <Text style={s.sectionTitle}>{t('legalEntity.sectionInfo')}</Text>

      <View style={s.infoFieldGroup}>
        <ProfileReadOnlyField label={t('login.registerLegalCompanyName')} value={entity.name} />
        <ProfileReadOnlyField label={t('cases.legalIdentificationCodeLabel')} value={entity.legalNumber} />
        <ProfileReadOnlyField label={t('legalEntity.labelMemberName')} value={entity.memberName} />
        <ProfileReadOnlyField label={t('profile.labelLegalAddress')} value={entity.address} />
        <ProfileReadOnlyField label={t('profile.labelRealAddress')} value={entity.realAddress} />
        <ProfileReadOnlyField label={t('profile.labelEmail')} value={entity.email} />
      </View>

      <View style={s.rowButtons}>
        <Pressable style={s.buttonOutline} onPress={onEdit} accessibilityRole="button">
          <Text style={s.buttonOutlineText}>{t('profile.editButton')}</Text>
        </Pressable>
      </View>
    </View>
  );
}
