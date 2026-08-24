import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Switch, Text, View } from 'react-native';

import { LoginPalette } from '@/constants/login';
import { useDeviceTrust } from '@/hooks/use-device-trust';
import { resolveDeviceName } from '@/lib/device-info';
import { showErrorToast } from '@/lib/show-error-toast';
import type { RegisterDeviceResult } from '@/types/passkey';

import { ProfileDeviceTrustModal } from './profile-device-trust-modal';
import { profileFaceIdSectionStyles as s } from './profile-face-id-section.styles';
import { profileScreenStyles as ps } from './profile-screen.styles';

type StatusMessage = { type: 'success' | 'error'; text: string };

/**
 * "Trust this device" — registers a native passkey so the user can later sign in
 * with Face ID / fingerprint instead of a password. Built to read like the Face
 * ID section it sits next to.
 */
export function ProfileDeviceTrustSection() {
  const { t } = useTranslation();
  const trust = useDeviceTrust();
  const [modalVisible, setModalVisible] = useState(false);
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);

  const description = !trust.isSupported
    ? t('deviceTrust.unavailable')
    : trust.isTrusted
      ? t('deviceTrust.descriptionEnabled')
      : t('deviceTrust.descriptionDisabled');

  const mapError = useCallback(
    (result: Extract<RegisterDeviceResult, { ok: false }>): string => {
      if (result.reason === 'unsupported') return t('deviceTrust.unavailable');
      if (result.reason === 'cancelled') return t('deviceTrust.errorCancelled');
      return t('deviceTrust.errorFailed');
    },
    [t],
  );

  const handleToggle = useCallback(
    async (next: boolean) => {
      setStatusMessage(null);
      if (next) {
        if (!trust.isSupported) return;
        setModalVisible(true);
        return;
      }
      // Revoke on the backend first; the Switch stays on until it succeeds
      // (its value is bound to `trust.isTrusted`, which only flips on success).
      const result = await trust.revokeDevice();
      if (result.ok) {
        setStatusMessage({ type: 'success', text: t('deviceTrust.forgetSuccess') });
      } else {
        showErrorToast(t('deviceTrust.forgetFailed'), result.error);
      }
    },
    [trust, t],
  );

  const handleConfirm = useCallback(
    async (label: string) => {
      // Close the label modal before the OS passkey sheet appears — on iOS a
      // visible RN Modal can make the system prompt fail (same reason the Face
      // ID flow dismisses its modal first).
      setModalVisible(false);
      const result = await trust.register(label);
      if (result.ok) {
        setStatusMessage({ type: 'success', text: t('deviceTrust.enableSuccess') });
        return;
      }
      if (result.reason !== 'cancelled') showErrorToast(mapError(result));
    },
    [trust, t, mapError],
  );

  return (
    <View style={ps.card}>
      <Text style={ps.sectionTitle}>{t('deviceTrust.sectionTitle')}</Text>

      <View style={s.row}>
        <View style={s.rowText}>
          <Text style={s.rowLabel}>{t('deviceTrust.rowLabel')}</Text>
          <Text style={s.rowDescription}>{description}</Text>
        </View>
        {trust.isLoading || trust.isBusy ? (
          <ActivityIndicator color={LoginPalette.primary} />
        ) : (
          <Switch
            value={trust.isTrusted}
            onValueChange={(v) => { handleToggle(v); }}
            disabled={!trust.isSupported && !trust.isTrusted}
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

      <ProfileDeviceTrustModal
        visible={modalVisible}
        isSubmitting={trust.isBusy}
        defaultLabel={resolveDeviceName()}
        onConfirm={(label) => { handleConfirm(label); }}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}
