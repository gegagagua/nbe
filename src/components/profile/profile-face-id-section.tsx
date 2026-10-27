import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, Switch, Text, View } from 'react-native';

import { PasswordHistoryModal } from '@/components/home/password-history-modal';
import { LoginOtpModal } from '@/components/login/login-otp-modal';
import { Card } from '@/components/ui/card';
import { useProfileFaceIdToggle } from '@/hooks/use-profile-face-id-toggle';
import { useAppTheme } from '@/theme';
import type { CreateSessionResponse } from '@/types/session';
import type { LoginHistoryEntry, PasswordHistoryApiEntry } from '@/types/users';

import { ProfileFaceIdEnableModal } from './profile-face-id-enable-modal';
import { ProfileLoginHistoryModal } from './profile-login-history-modal';

type StatusMessage = { type: 'success' | 'error'; text: string };

type Props = {
  username: string;
  loginHistory?: LoginHistoryEntry[];
  passwordHistory?: PasswordHistoryApiEntry[];
  verifyPassword?: (password: string) => Promise<CreateSessionResponse | null>;
  onStatus?: (msg: StatusMessage | null) => void;
};

export function ProfileFaceIdSection({
  username,
  loginHistory = [],
  passwordHistory,
  ...rest
}: Props) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const ctrl = useProfileFaceIdToggle({ username, ...rest });
  const { faceId } = ctrl;
  const [historyVisible, setHistoryVisible] = useState(false);
  const [loginHistoryVisible, setLoginHistoryVisible] = useState(false);

  const rowLabel =
    faceId.kind === 'faceId'
      ? t('faceId.rowLabelFaceId')
      : faceId.kind === 'fingerprint'
        ? t('faceId.rowLabelFingerprint')
        : t('faceId.rowLabelBiometric');

  const description = !faceId.availability.hasHardware
    ? t('faceId.unavailableHardware')
    : !faceId.availability.isEnrolled
      ? t('faceId.unavailableNotEnrolled')
      : faceId.isEnabled
        ? t('faceId.descriptionEnabled')
        : t('faceId.descriptionDisabled');

  return (
    <Card padding="lg" elevation="sm" className="gap-4 rounded-2xl">
      <Text className="text-heading font-bold text-fg">{t('faceId.sectionTitle')}</Text>

      <View className="flex-row items-center justify-between gap-3">
        <View className="flex-1 gap-0.5">
          <Text className="text-body font-semibold text-fg">{rowLabel}</Text>
          <Text className="text-label leading-[18px] text-fg-muted">{description}</Text>
        </View>
        {faceId.isLoading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Switch
            value={faceId.isEnabled}
            onValueChange={(v) => { ctrl.handleToggle(v); }}
            trackColor={{ true: colors.primary, false: colors.border }}
            thumbColor={colors.surface}
            ios_backgroundColor={colors.border}
          />
        )}
      </View>

      <View className="flex-row gap-2">
        <Pressable
          className="flex-1 items-center rounded-sm border border-primary px-2 py-1 active:opacity-70"
          onPress={() => setHistoryVisible(true)}
          accessibilityRole="button">
          <Text className="text-label font-semibold text-primary">
            {t('passwordHistory.buttonLabel')}
          </Text>
        </Pressable>
        <Pressable
          className="flex-1 items-center rounded-sm border border-primary px-2 py-1 active:opacity-70"
          onPress={() => setLoginHistoryVisible(true)}
          accessibilityRole="button">
          <Text className="text-label font-semibold text-primary">
            {t('loginHistory.buttonLabel')}
          </Text>
        </Pressable>
      </View>

      {ctrl.statusMessage ? (
        <Text
          className={`text-center text-label font-semibold ${
            ctrl.statusMessage.type === 'success' ? 'text-success' : 'text-danger'
          }`}>
          {ctrl.statusMessage.text}
        </Text>
      ) : null}

      <ProfileFaceIdEnableModal
        visible={ctrl.modalVisible}
        isSubmitting={ctrl.isSubmitting}
        errorMessage={ctrl.modalError}
        onConfirm={(pw) => { ctrl.handleConfirmEnable(pw); }}
        onClose={ctrl.closeModal}
      />
      <LoginOtpModal
        visible={ctrl.otp.visible}
        isSubmitting={ctrl.otp.isSubmitting}
        onSubmit={ctrl.otp.onSubmit}
        onCancel={ctrl.otp.onCancel}
      />
      <PasswordHistoryModal
        visible={historyVisible}
        onClose={() => setHistoryVisible(false)}
        apiEntries={passwordHistory}
      />
      <ProfileLoginHistoryModal
        visible={loginHistoryVisible}
        entries={loginHistory}
        onClose={() => setLoginHistoryVisible(false)}
      />
    </Card>
  );
}
