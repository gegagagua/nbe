import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, Switch, Text, View } from 'react-native';

import { PasswordHistoryModal } from '@/components/home/password-history-modal';
import { LoginPalette } from '@/constants/login';
import { useProfileFaceIdToggle } from '@/hooks/use-profile-face-id-toggle';
import type { UserAuthority } from '@/types/user-authority';

import { ProfileAuthoritiesModal } from './profile-authorities-modal';
import { ProfileFaceIdEnableModal } from './profile-face-id-enable-modal';
import { profileFaceIdSectionStyles as s } from './profile-face-id-section.styles';
import { profileScreenStyles as ps } from './profile-screen.styles';

type StatusMessage = { type: 'success' | 'error'; text: string };

type Props = {
  username: string;
  authorities?: UserAuthority[];
  verifyPassword?: (password: string) => Promise<boolean>;
  onStatus?: (msg: StatusMessage | null) => void;
};

export function ProfileFaceIdSection({ username, authorities = [], ...rest }: Props) {
  const { t } = useTranslation();
  const ctrl = useProfileFaceIdToggle({ username, ...rest });
  const { faceId } = ctrl;
  const [historyVisible, setHistoryVisible] = useState(false);
  const [activitiesVisible, setActivitiesVisible] = useState(false);

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
    <View style={ps.card}>
      <Text style={ps.sectionTitle}>{t('faceId.sectionTitle')}</Text>

      <View style={s.row}>
        <View style={s.rowText}>
          <Text style={s.rowLabel}>{rowLabel}</Text>
          <Text style={s.rowDescription}>{description}</Text>
        </View>
        {faceId.isLoading ? (
          <ActivityIndicator color={LoginPalette.primary} />
        ) : (
          <Switch
            value={faceId.isEnabled}
            onValueChange={(v) => void ctrl.handleToggle(v)}
            disabled={!faceId.availability.isAvailable && !faceId.isEnabled}
            trackColor={{ true: LoginPalette.primary, false: '#cfd8ea' }}
            thumbColor="#ffffff"
            ios_backgroundColor="#cfd8ea"
          />
        )}
      </View>

      <View style={s.actionRow}>
        <Pressable
          style={s.actionButton}
          onPress={() => setHistoryVisible(true)}
          accessibilityRole="button">
          <Text style={s.actionButtonText}>{t('passwordHistory.buttonLabel')}</Text>
        </Pressable>
        <Pressable
          style={s.actionButton}
          onPress={() => setActivitiesVisible(true)}
          accessibilityRole="button">
          <Text style={s.actionButtonText}>{t('profile.activitiesButton')}</Text>
        </Pressable>
      </View>

      {ctrl.statusMessage ? (
        <Text
          style={[
            ps.statusMessage,
            ctrl.statusMessage.type === 'success' ? ps.statusSuccess : ps.statusError,
          ]}>
          {ctrl.statusMessage.text}
        </Text>
      ) : null}

      <ProfileFaceIdEnableModal
        visible={ctrl.modalVisible}
        isSubmitting={ctrl.isSubmitting}
        errorMessage={ctrl.modalError}
        onConfirm={(pw) => void ctrl.handleConfirmEnable(pw)}
        onClose={ctrl.closeModal}
      />
      <PasswordHistoryModal visible={historyVisible} onClose={() => setHistoryVisible(false)} />
      <ProfileAuthoritiesModal
        visible={activitiesVisible}
        authorities={authorities}
        onClose={() => setActivitiesVisible(false)}
      />
    </View>
  );
}
