import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { usePushPreference } from '@/hooks/use-push-preference';

type Props = {
  userId: number | null | undefined;
};

/** Push notifications status for the current user on this device. */
export function ProfilePushSection({ userId }: Props) {
  const { t } = useTranslation();
  const push = usePushPreference(userId);

  const description = !push.isSupported
    ? t('notifications.push.unavailable')
    : push.isEnabled
      ? t('notifications.push.descriptionEnabled')
      : t('notifications.push.descriptionDisabled');

  return (
    <Card padding="lg" elevation="sm" className="gap-4 rounded-2xl">
      <Text className="text-heading font-bold text-fg">{t('notifications.pageTitle')}</Text>

      <View className="flex-row items-center justify-between gap-3">
        <View className="flex-1 gap-0.5">
          <Text className="text-body font-semibold text-fg">{t('notifications.push.rowLabel')}</Text>
          <Text
            className={`text-label font-bold ${
              push.isEnabled ? 'text-success' : 'text-fg-muted'
            }`}>
            {push.isEnabled
              ? t('deviceTrust.statusActive')
              : t('deviceTrust.statusInactive')}
          </Text>
          <Text className="text-label leading-[18px] text-fg-muted">{description}</Text>
        </View>
      </View>
    </Card>
  );
}
