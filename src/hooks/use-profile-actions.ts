import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { updateUser, updateUserPassword } from '@/api/users';
import { clearFaceIdAll } from '@/lib/face-id-storage';
import { mapChangePasswordError } from '@/lib/map-change-password-error';
import { mapUpdateUserError } from '@/lib/map-update-user-error';
import { isSimilarPasswordUsed, recordPasswordChange } from '@/lib/password-history-storage';
import { setSessionUserProfile } from '@/lib/session-user-profile-storage';
import type { SessionUserProfileBrief } from '@/types/session';

type StatusMessage = { type: 'success' | 'error'; text: string };

type UseProfileActionsArgs = {
  profile: SessionUserProfileBrief | null;
  onProfileUpdated?: (next: SessionUserProfileBrief) => void;
};

export function useProfileActions({ profile, onProfileUpdated }: UseProfileActionsArgs) {
  const { t } = useTranslation();
  const [infoStatus, setInfoStatus] = useState<StatusMessage | null>(null);
  const [pwStatus, setPwStatus] = useState<StatusMessage | null>(null);
  const [isSavingInfo, setIsSavingInfo] = useState(false);
  const [isChangingPw, setIsChangingPw] = useState(false);

  const handleSaveInfo = useCallback(
    async (values: { firstName: string; lastName: string }) => {
      if (!profile) {
        setInfoStatus({ type: 'error', text: t('profile.saveMissingSession') });
        return;
      }
      setIsSavingInfo(true);
      setInfoStatus(null);
      try {
        await updateUser(profile.id, {
          username: profile.username,
          firstName: values.firstName,
          lastName: values.lastName,
        });
        const updated: SessionUserProfileBrief = { ...profile, ...values };
        await setSessionUserProfile(updated);
        onProfileUpdated?.(updated);
        setInfoStatus({ type: 'success', text: t('profile.saveSuccess') });
      } catch (err) {
        setInfoStatus({ type: 'error', text: mapUpdateUserError(err) });
      } finally {
        setIsSavingInfo(false);
      }
    },
    [onProfileUpdated, profile, t],
  );

  const handleChangePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      if (!profile) {
        setPwStatus({ type: 'error', text: t('profile.changePasswordMissingSession') });
        return;
      }
      setIsChangingPw(true);
      setPwStatus(null);
      try {
        const alreadyUsed = await isSimilarPasswordUsed(newPassword);
        if (alreadyUsed) {
          setPwStatus({ type: 'error', text: t('validation.similarPasswordUsed') });
          return;
        }
        await updateUserPassword(profile.id, {
          crntPwd: currentPassword,
          newPwd: newPassword,
          retypeNewPwd: newPassword,
        });
        await recordPasswordChange(newPassword);
        await clearFaceIdAll();
        setPwStatus({ type: 'success', text: t('profile.changePasswordSuccess') });
      } catch (err) {
        setPwStatus({ type: 'error', text: mapChangePasswordError(err) });
      } finally {
        setIsChangingPw(false);
      }
    },
    [profile, t],
  );

  return {
    infoStatus,
    pwStatus,
    isSavingInfo,
    isChangingPw,
    handleSaveInfo,
    handleChangePassword,
  };
}
