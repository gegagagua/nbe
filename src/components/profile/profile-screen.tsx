import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

import { AppSafeArea } from '@/components/ui/app-safe-area';
import { LoginPalette } from '@/constants/login';
import { isSimilarPasswordUsed, recordPasswordChange } from '@/lib/password-history-storage';
import { setSessionUserProfile } from '@/lib/session-user-profile-storage';
import { signOut } from '@/lib/sign-out';
import { useSessionUserProfile } from '@/hooks/use-session-user-profile';

import { ProfileChangePasswordSection } from './profile-change-password-section';
import { ProfileInfoSection } from './profile-info-section';
import { profileScreenStyles as s } from './profile-screen.styles';

type StatusMessage = { type: 'success' | 'error'; text: string };

export function ProfileScreen() {
  const { t } = useTranslation();
  const { profile, isLoading } = useSessionUserProfile();
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
        setPwStatus({ type: 'success', text: t('profile.changePasswordSuccess') });
      } catch {
        setPwStatus({ type: 'error', text: t('profile.changePasswordError') });
      } finally {
        setIsChangingPw(false);
      }
    },
    [t],
  );

  function handleSignOut() {
    void signOut();
  }

  if (isLoading) {
    return (
      <View style={[s.page, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={LoginPalette.primary} />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={[s.page, { justifyContent: 'center', alignItems: 'center' }]}>
        <View style={s.header}>
          <Pressable style={s.backButton} onPress={() => router.back()} accessibilityRole="button">
            <Text style={s.backButtonText}>←</Text>
          </Pressable>
        </View>
        <ActivityIndicator size="large" color={LoginPalette.primary} />
      </View>
    );
  }

  return (
    <View style={s.page}>
      <AppSafeArea style={{ flex: 1 }}>
        <View style={s.header}>
          <Pressable
            style={s.backButton}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel={t('profile.backA11yLabel')}>
            <Text style={s.backButtonText}>←</Text>
          </Pressable>
          <Text style={s.pageTitle}>{t('profile.pageTitle')}</Text>
        </View>

        <ScrollView
          style={s.scroll}
          contentContainerStyle={s.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          <ProfileInfoSection
            profile={profile}
            onSave={handleSaveInfo}
            isSaving={isSavingInfo}
            statusMessage={infoStatus}
          />

          <View style={s.divider} />

          <ProfileChangePasswordSection
            onSubmit={handleChangePassword}
            isSubmitting={isChangingPw}
            statusMessage={pwStatus}
          />

          <Pressable
            style={s.signOutButton}
            onPress={handleSignOut}
            accessibilityRole="button">
            <Text style={s.signOutButtonText}>{t('profile.signOutButton')}</Text>
          </Pressable>
        </ScrollView>
      </AppSafeArea>
    </View>
  );
}
