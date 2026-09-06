import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Switch, Text, View } from 'react-native';

import { LoginDeviceTrustPrompt } from '@/components/login/login-device-trust-prompt';
import { LoginPalette } from '@/constants/login';
import { useDeviceTrust } from '@/hooks/use-device-trust';
import { showErrorToast } from '@/lib/show-error-toast';
import type { RegisterDeviceResult } from '@/types/passkey';

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

  const description = trust.isTrusted
    ? t('deviceTrust.descriptionEnabled')
    : trust.requiresBiometricSetup
      ? t('deviceTrust.requiresBiometrics')
      : !trust.isSupported
        ? t('deviceTrust.unavailable')
        : t('deviceTrust.descriptionDisabled');

  const mapError = useCallback(
    (result: Extract<RegisterDeviceResult, { ok: false }>): string => {
      if (result.reason === 'unsupported') return t('deviceTrust.unavailable');
      if (result.reason === 'cancelled') return t('deviceTrust.errorCancelled');
      if (result.reason === 'already-registered')
        return t('deviceTrust.errorAlreadyRegistered');
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
      // Frontend-first: revokeDevice flips the switch off locally right away, so
      // the toggle always reflects the action. Only note it if the backend sync
      // failed — the device is already forgotten on this phone.
      const result = await trust.revokeDevice();
      if (result.serverSynced) {
        setStatusMessage({ type: 'success', text: t('deviceTrust.forgetSuccess') });
      } else {
        setStatusMessage({ type: 'error', text: t('deviceTrust.forgetServerFailed') });
      }
    },
    [trust, t],
  );

  const handleConfirm = useCallback(
    async () => {
      // Close the confirmation modal before the OS passkey sheet appears — on iOS
      // a visible RN Modal can make the system prompt fail (same reason the Face
      // ID flow dismisses its modal first). No label is asked for: the backend
      // still gets the technical device name as the label via `register`.
      setModalVisible(false);
      const result = await trust.register('');
      if (result.ok) {
        setStatusMessage({ type: 'success', text: t('deviceTrust.enableSuccess') });
        return;
      }
      // Already trusted server-side — the switch is on; show it as a success,
      // not an error.
      if (result.reason === 'already-registered') {
        setStatusMessage({
          type: 'success',
          text: result.message ?? t('deviceTrust.errorAlreadyRegistered'),
        });
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
          {/* On/off status indicator (NM-318): green "აქტიური" when trusted. */}
          <Text
            style={[
              s.statusText,
              trust.isTrusted ? s.statusActive : s.statusInactive,
            ]}>
            {trust.isTrusted
              ? t('deviceTrust.statusActive')
              : t('deviceTrust.statusInactive')}
          </Text>
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

      {/* Same Yes/No confirmation the post-login prompt shows — no device-name
          input (NM-317). */}
      <LoginDeviceTrustPrompt
        visible={modalVisible}
        isSubmitting={trust.isBusy}
        onConfirm={() => { handleConfirm(); }}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}
