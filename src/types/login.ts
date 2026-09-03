import type { ReactNode } from 'react';
import type { Control, FieldErrors } from 'react-hook-form';

import type { LoginFormValues } from '@/types/login-form-values';

export type LoginScreenLayoutProps = {
  children: ReactNode;
  title?: string;
  contentAlign?: 'center' | 'top';
};

export type LoginFaceIdProps = {
  show: boolean;
  label: string;
  iconName: 'face-recognition' | 'fingerprint';
  onPress: () => void;
  disabled?: boolean;
};

export type LoginPasskeyProps = {
  show: boolean;
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export type LoginFormProps = {
  control: Control<LoginFormValues>;
  errors: FieldErrors<LoginFormValues>;
  onSubmit: () => void;
  submitDisabled: boolean;
  onRegisterPress: () => void;
  onGuestPress: () => void;
  onIdentomatDemoPress: () => void;
  onForgotPasswordPress: () => void;
  faceId?: LoginFaceIdProps;
  passkey?: LoginPasskeyProps;
};

export type ForcedPwdChangeState = {
  visible: boolean;
  isSubmitting: boolean;
  onSubmit: (newPwd: string) => Promise<void>;
};

export type OtpLoginState = {
  visible: boolean;
  isSubmitting: boolean;
  onSubmit: (code: string) => Promise<void>;
  onCancel: () => void;
};

/**
 * Post-login "trust this device" prompt. Shown after a password/OTP sign-in when
 * passkeys are supported and this device isn't trusted yet; confirming or
 * skipping both continue into the app.
 */
export type DeviceTrustPromptState = {
  visible: boolean;
  isSubmitting: boolean;
  defaultLabel: string;
  onConfirm: (label: string) => Promise<void>;
  onSkip: () => void;
};

export type LoginFormState = {
  control: Control<LoginFormValues>;
  errors: FieldErrors<LoginFormValues>;
  onSubmit: () => void;
  submitDisabled: boolean;
  submitWithCredentials: (
    values: LoginFormValues,
  ) => Promise<{ ok: true } | { ok: false; error: unknown }>;
  /** Persist a session produced by passkey login and navigate into the app. */
  completePasskeyLogin: (
    session: import('@/types/session').CreateSessionResponse,
  ) => Promise<void>;
  forcedPwdChange: ForcedPwdChangeState;
  otpLogin: OtpLoginState;
  deviceTrustPrompt: DeviceTrustPromptState;
};
