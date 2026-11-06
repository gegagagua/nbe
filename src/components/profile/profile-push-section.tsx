import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Switch, Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { usePushPreference } from '@/hooks/use-push-preference';
import { useAppTheme } from '@/theme';

type StatusMessage = { type: 'success' | 'error'; text: string };

type Props = {
  userId: number | null | undefined;
};

/**
 * Push notifications on/off for the current user on this device only. Other
 * devices of the same user keep their own setting.
 */
export function ProfilePushSection({ userId }: Props) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const push = usePushPreference(userId);
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);

  const handleToggle = useCallback(
    async (next: boolean) => {
      setStatusMessage(null);
      const result = await push.toggle(next);
      if (result.ok) {
        setStatusMessage({
          type: 'success',
          text: next
            ? t('notifications.push.enableSuccess')
            : t('notifications.push.disableSuccess'),
        });
        return;
      }
      setStatusMessage({
        type: 'error',
        text:
          result.reason === 'unavailable'
            ? t('notifications.push.permissionDenied')
            : t('notifications.push.errorFailed'),
      });
    },
    [push, t],
  );

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
        {push.isLoading || push.isBusy ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Switch
            value={push.isEnabled}
            onValueChange={(v) => { handleToggle(v); }}
            disabled={!push.isSupported || !userId}
            trackColor={{ true: colors.primary, false: colors.border }}
            thumbColor={colors.surface}
            ios_backgroundColor={colors.border}
          />
        )}
      </View>

      {statusMessage ? (
        <Text
          className={`text-center text-label font-semibold ${
            statusMessage.type === 'success' ? 'text-success' : 'text-danger'
          }`}>
          {statusMessage.text}
        </Text>
      ) : null}
    </Card>
  );
}
