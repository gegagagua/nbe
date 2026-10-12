import { router } from "expo-router";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import {
  KeyboardAwareScrollView,
  type KeyboardAwareScrollViewRef,
} from "react-native-keyboard-controller";

import { LoginOtpModal } from "@/components/login/login-otp-modal";
import { AppSafeArea } from "@/components/ui/app-safe-area";
import { LoginPalette } from "@/constants/login";
import { useActiveLegalEntity } from "@/hooks/use-active-legal-entity";
import { useLegalEntities } from "@/hooks/use-legal-entities";
import { useProfileActions } from "@/hooks/use-profile-actions";
import { useSessionUserProfile } from "@/hooks/use-session-user-profile";
import { useUserDetail } from "@/hooks/use-user-detail";
import { useVerifyCurrentPassword } from "@/hooks/use-verify-current-password";
import {
    resolveUserEmail,
    resolveUserPhone,
} from "@/lib/resolve-user-contacts";
import { signOut } from "@/lib/sign-out";
import type { LoginHistoryEntry, PasswordHistoryApiEntry } from "@/types/users";

import { ProfileAccountCard } from "./profile-account-card";
import {
  ProfileAccountSwitchModal,
  type ProfileAccountOption,
} from "./profile-account-switch-modal";
import { ProfileChangePasswordSection } from "./profile-change-password-section";
import { ProfileDeviceTrustSection } from "./profile-device-trust-section";
import { ProfileFaceIdSection } from "./profile-face-id-section";
import { ProfileInfoSection } from "./profile-info-section";
import { profileScreenStyles as s } from "./profile-screen.styles";

export function ProfileScreen() {
  const { t } = useTranslation();
  const { profile, isLoading } = useSessionUserProfile();

  const { detail, refetch } = useUserDetail();
  const actions = useProfileActions({
    profile,
    detail,
    onDetailRefetch: refetch,
  });
  const verifyPassword = useVerifyCurrentPassword(profile?.username);
  const scrollRef = useRef<KeyboardAwareScrollViewRef>(null);
  const infoSectionY = useRef(0);
  const [accountSwitchVisible, setAccountSwitchVisible] = useState(false);
  const legalEntities = useLegalEntities();
  const activeLegalEntity = useActiveLegalEntity();

  // Surface lastSession + pwdChngDate that came back with the login response in
  // the same modals the /users/me history feeds, so users see them even when
  // the detail call hasn't returned (or hasn't yet been re-fetched).
  const loginHistory = mergeLoginHistory(
    detail?.loginHistory,
    profile?.lastSession,
  );
  const passwordHistory = mergePasswordHistory(
    detail?.passwordHistory,
    profile?.pwdChngDate,
  );

  function handleSignOut() {
    signOut();
  }

  function handleViewInfo() {
    if (activeLegalEntity.entity) {
      router.push(`/legal-entity/${activeLegalEntity.entity.id}`);
      return;
    }
    scrollRef.current?.scrollTo({ y: infoSectionY.current, animated: true });
  }

  const fullName =
    [detail?.firstName, detail?.lastName].filter(Boolean).join(" ") ||
    profile?.username ||
    "";

  // The physical user first, then the legal entities they can switch to.
  // Ids are prefixed so a user id never collides with a legal-entity id.
  const personalAccountId = profile ? `user-${profile.id}` : null;
  const currentAccountId = activeLegalEntity.entity
    ? `legal-${activeLegalEntity.entity.id}`
    : personalAccountId;
  const accounts: ProfileAccountOption[] = [
    ...(personalAccountId ? [{ id: personalAccountId, name: fullName }] : []),
    ...legalEntities.entities.map((entity) => ({
      id: `legal-${entity.id}`,
      name: entity.name,
    })),
  ];

  function handleOpenAccountSwitch() {
    setAccountSwitchVisible(true);
    legalEntities.refetch();
  }

  function handleSelectAccount(account: ProfileAccountOption) {
    setAccountSwitchVisible(false);
    if (account.id === currentAccountId) return;
    if (account.id === personalAccountId) {
      activeLegalEntity.switchToPersonal();
      return;
    }
    // Switching to a legal entity goes through its details page, which
    // collects the required actual address before the switch is saved.
    router.push(`/legal-entity/${account.id.replace("legal-", "")}`);
  }

  if (isLoading) {
    return (
      <View
        style={[s.page, { justifyContent: "center", alignItems: "center" }]}
      >
        <ActivityIndicator size="large" color={LoginPalette.primary} />
      </View>
    );
  }

  if (!profile) {
    return (
      <View
        style={[s.page, { justifyContent: "center", alignItems: "center" }]}
      >
        <View style={s.header}>
          <Pressable
            style={s.backButton}
            onPress={() => router.back()}
            accessibilityRole="button"
          >
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
            accessibilityLabel={t("profile.backA11yLabel")}
          >
            <Text style={s.backButtonText}>←</Text>
          </Pressable>
          <Text style={s.pageTitle}>{t("profile.pageTitle")}</Text>
        </View>

        <KeyboardAwareScrollView
          ref={scrollRef}
          style={s.scroll}
          contentContainerStyle={s.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bottomOffset={16}
        >
          <ProfileAccountCard
            fullName={activeLegalEntity.entity?.name ?? fullName}
            subtitle={
              activeLegalEntity.entity
                ? t("profile.viewCompanyDetails")
                : t("profile.viewPersonalInfo")
            }
            onViewInfo={handleViewInfo}
            onSwitchAccount={handleOpenAccountSwitch}
          />

          <View
            onLayout={(e) => {
              infoSectionY.current = e.nativeEvent.layout.y;
            }}
          >
            <ProfileInfoSection
              firstName={detail?.firstName ?? null}
              lastName={detail?.lastName ?? null}
              idnumber={detail?.idnumber?.trim() || undefined}
              phone={resolveUserPhone(detail?.contacts)}
              email={resolveUserEmail(detail?.contacts)}
              realAddress={detail?.realAddress?.trim() ?? ""}
              legalAddress={detail?.legalAddress?.trim() ?? ""}
              canEdit={detail !== null}
              onSave={actions.handleSaveInfo}
              isSaving={actions.isSavingInfo}
              statusMessage={actions.infoStatus}
            />
          </View>

          <View style={s.divider} />

          <ProfileFaceIdSection
            username={profile.username}
            loginHistory={loginHistory}
            passwordHistory={passwordHistory}
            verifyPassword={verifyPassword}
          />

          <View style={s.divider} />

          <ProfileDeviceTrustSection />

          <View style={s.divider} />

          <ProfileChangePasswordSection
            onSubmit={actions.handleChangePassword}
            isSubmitting={actions.isChangingPw}
            statusMessage={actions.pwStatus}
          />

          <Pressable
            style={s.signOutButton}
            onPress={handleSignOut}
            accessibilityRole="button"
          >
            <Text style={s.signOutButtonText}>
              {t("profile.signOutButton")}
            </Text>
          </Pressable>
        </KeyboardAwareScrollView>
      </AppSafeArea>
      <ProfileAccountSwitchModal
        visible={accountSwitchVisible}
        accounts={accounts}
        selectedId={currentAccountId}
        isLoading={legalEntities.isLoading}
        onSelect={handleSelectAccount}
        onClose={() => setAccountSwitchVisible(false)}
      />
      <LoginOtpModal
        visible={actions.phoneOtp.visible}
        isSubmitting={actions.phoneOtp.isSubmitting}
        onSubmit={actions.phoneOtp.onSubmit}
        onCancel={actions.phoneOtp.onCancel}
        title={t("profile.phoneOtpTitle")}
        description={t("profile.phoneOtpDescription")}
        cancelLabel={t("profile.phoneOtpCancel")}
      />
    </View>
  );
}

function mergeLoginHistory(
  history: LoginHistoryEntry[] | undefined,
  lastSession:
    | { id: number; createdDate: string; ipAddress: string | null }
    | null
    | undefined,
): LoginHistoryEntry[] {
  const base = history ?? [];
  if (!lastSession?.createdDate) return base;
  const entry: LoginHistoryEntry = {
    date: lastSession.createdDate,
    success: true,
    ipAddress: lastSession.ipAddress ?? null,
    userAgent: null,
  };
  if (base.some((e) => e.date === entry.date)) return base;
  return [entry, ...base];
}

function mergePasswordHistory(
  history: PasswordHistoryApiEntry[] | undefined,
  pwdChngDate: string | null | undefined,
): PasswordHistoryApiEntry[] {
  const base = history ?? [];
  if (!pwdChngDate) return base;
  if (base.some((e) => e.date === pwdChngDate)) return base;
  return [
    ...base,
    { date: pwdChngDate, success: true, ipAddress: null, userAgent: null },
  ];
}
