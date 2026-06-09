import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { AppSafeArea } from '@/components/ui/app-safe-area';
import { LoginPalette } from '@/constants/login';
import { useProfileActions } from '@/hooks/use-profile-actions';
import { useSessionUserProfile } from '@/hooks/use-session-user-profile';
import { useUserDetail } from '@/hooks/use-user-detail';
import { useVerifyCurrentPassword } from '@/hooks/use-verify-current-password';
import { resolveUserEmail, resolveUserPhone } from '@/lib/resolve-user-contacts';
import { signOut } from '@/lib/sign-out';

import { ProfileChangePasswordSection } from './profile-change-password-section';
import { ProfileFaceIdSection } from './profile-face-id-section';
import { ProfileInfoSection } from './profile-info-section';
import { profileScreenStyles as s } from './profile-screen.styles';

export function ProfileScreen() {
  const { t } = useTranslation();
  const { profile, isLoading } = useSessionUserProfile();

  const { detail, refetch } = useUserDetail();
  const verifyPassword = useVerifyCurrentPassword(profile?.username);
  const actions = useProfileActions({
    profile,
    detail,
    onDetailRefetch: refetch,
  });

  function handleSignOut() {
    signOut();
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

        <KeyboardAwareScrollView
          style={s.scroll}
          contentContainerStyle={s.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bottomOffset={16}>
          <ProfileInfoSection
            firstName={detail?.firstName ?? null}
            lastName={detail?.lastName ?? null}
            idnumber={detail?.idnumber?.trim() || undefined}
            phone={resolveUserPhone(detail?.contacts)}
            email={resolveUserEmail(detail?.contacts)}
            realAddress={detail?.realAddress?.trim() ?? ''}
            legalAddress={detail?.legalAddress?.trim() ?? ''}
            canEdit={detail !== null}
            onSave={actions.handleSaveInfo}
            isSaving={actions.isSavingInfo}
            statusMessage={actions.infoStatus}
          />

          <View style={s.divider} />

          <ProfileFaceIdSection
            username={profile.username}
            authorities={detail?.authorities ?? []}
            verifyPassword={verifyPassword}
          />

          <View style={s.divider} />

          <ProfileChangePasswordSection
            onSubmit={actions.handleChangePassword}
            isSubmitting={actions.isChangingPw}
            statusMessage={actions.pwStatus}
          />

          <Pressable
            style={s.signOutButton}
            onPress={handleSignOut}
            accessibilityRole="button">
            <Text style={s.signOutButtonText}>{t('profile.signOutButton')}</Text>
          </Pressable>
        </KeyboardAwareScrollView>
      </AppSafeArea>
    </View>
  );
}
