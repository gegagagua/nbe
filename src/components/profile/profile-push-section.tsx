import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Switch, Text, View } from 'react-native';

import { LoginPalette } from '@/constants/login';
import { usePushPreference } from '@/hooks/use-push-preference';

import { profileFaceIdSectionStyles as s } from './profile-face-id-section.styles';
import { profileScreenStyles as ps } from './profile-screen.styles';

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
    <View style={ps.card}>
      <Text style={ps.sectionTitle}>{t('notifications.pageTitle')}</Text>

      <View style={s.row}>
        <View style={s.rowText}>
          <Text style={s.rowLabel}>{t('notifications.push.rowLabel')}</Text>
          <Text
            style={[
              s.statusText,
              push.isEnabled ? s.statusActive : s.statusInactive,
            ]}>
            {push.isEnabled
              ? t('deviceTrust.statusActive')
              : t('deviceTrust.statusInactive')}
          </Text>
          <Text style={s.rowDescription}>{description}</Text>
        </View>
        {push.isLoading || push.isBusy ? (
          <ActivityIndicator color={LoginPalette.primary} />
        ) : (
          <Switch
            value={push.isEnabled}
            onValueChange={(v) => { handleToggle(v); }}
            disabled={!push.isSupported || !userId}
            trackColor={{ true: LoginPalette.primary, false: '#cfd8ea' }}
            thumbColor="#ffffff"
            ios_backgroundColor="#cfd8ea"
          />
        )}
      </View>

      {statusMessage ? (
        <Text
          style={[
            ps.statusMessage,
            statusMessage.type === 'success' ? ps.statusSuccess : ps.statusError,
          ]}>
          {statusMessage.text}
        </Text>
      ) : null}
    </View>
  );
}
