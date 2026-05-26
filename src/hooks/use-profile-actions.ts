import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { clearFaceIdAll } from '@/lib/face-id-storage';
import { isSimilarPasswordUsed, recordPasswordChange } from '@/lib/password-history-storage';
import { setSessionUserProfile } from '@/lib/session-user-profile-storage';
import type { SessionUserProfileBrief } from '@/types/session';

type StatusMessage = { type: 'success' | 'error'; text: string };

export function useProfileActions(profile: SessionUserProfileBrief | null) {
  const { t } = useTranslation();
  const [infoStatus, setInfoStatus] = useState<StatusMessage | null>(null);
  const [pwStatus, setPwStatus] = useState<StatusMessage | null>(null);
  const [isSavingInfo, setIsSavingInfo] = useState(false);
  const [isChangingPw, setIsChangingPw] = useState(false);

  const handleSaveInfo = useCallback(
    async (values: { firstName: string; lastName: string }) => {
      if (!profile) return;
      setIsSavingInfo(true);
      setInfoStatus(null);
      try {
        const updated = { ...profile, ...values };
        await setSessionUserProfile(updated);
        setInfoStatus({ type: 'success', text: t('profile.saveSuccess') });
      } catch {
        setInfoStatus({ type: 'error', text: t('profile.saveError') });
      } finally {
        setIsSavingInfo(false);
      }
    },
    [profile, t],
  );

  const handleChangePassword = useCallback(
    async (_currentPassword: string, newPassword: string) => {
      setIsChangingPw(true);
      setPwStatus(null);
      try {
        const alreadyUsed = await isSimilarPasswordUsed(newPassword);
        if (alreadyUsed) {
          setPwStatus({ type: 'error', text: t('validation.similarPasswordUsed') });
          return;
        }
        // TODO: call change-password API when endpoint is available
        await recordPasswordChange(newPassword);
        // Stored Face ID password is now stale.
        await clearFaceIdAll();
        setPwStatus({ type: 'success', text: t('profile.changePasswordSuccess') });
      } catch {
        setPwStatus({ type: 'error', text: t('profile.changePasswordError') });
      } finally {
        setIsChangingPw(false);
      }
    },
    [t],
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
