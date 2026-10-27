import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { LegalEntity } from '@/types/users';

import { ProfileReadOnlyField } from './profile-read-only-field';

type Props = {
  entity: LegalEntity;
  onEdit: () => void;
};

export function ProfileLegalEntityInfoSection({ entity, onEdit }: Props) {
  const { t } = useTranslation();

  return (
    <Card padding="lg" elevation="sm" className="gap-4 rounded-2xl">
      <Text className="text-heading font-bold text-fg">{t('legalEntity.sectionInfo')}</Text>

      <View className="gap-2.5">
        <ProfileReadOnlyField label={t('login.registerLegalCompanyName')} value={entity.name} />
        <ProfileReadOnlyField label={t('cases.legalIdentificationCodeLabel')} value={entity.legalNumber} />
        <ProfileReadOnlyField label={t('legalEntity.labelMemberName')} value={entity.memberName} />
        <ProfileReadOnlyField label={t('profile.labelLegalAddress')} value={entity.address} />
        <ProfileReadOnlyField label={t('profile.labelRealAddress')} value={entity.realAddress} />
        <ProfileReadOnlyField label={t('profile.labelEmail')} value={entity.email} />
      </View>

      <Button label={t('profile.editButton')} onPress={onEdit} variant="secondary" />
    </Card>
  );
}
