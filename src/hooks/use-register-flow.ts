import { useRouter } from "expo-router";
import { useCallback, useState } from "react";

import { checkVerification, createPortalUser, verifyPhoneOtp } from "@/api/users";
import type { CheckVerificationResult } from "@/types/users";
import i18n from "@/i18n/i18n";
import { mapRegisterError } from "@/lib/map-register-error";
import { normalizeGeorgianPhone } from "@/lib/phone";
import { showErrorToast } from "@/lib/show-error-toast";
import { showSuccessToast } from "@/lib/show-success-toast";
import type { RegisterPhysicalValues } from "@/types/register-form-values";

function toCreatePortalUserPayload(values: RegisterPhysicalValues) {
  return {
    idnumber: values.personalId,
    mobile: normalizeGeorgianPhone(values.phone),
    email: values.email ?? "",
    realAddress: values.actualAddress,
    legalAddress: values.legalAddress ?? "",
    pwd: values.password,
    retypePwd: values.confirmPassword,
  };
}

/**
 * Drives the registration flow. Each step (form → otp → identomat → success)
 * is a separate route under `/register`, so advancing pushes a new route and
 * going back is the platform's own pop/swipe — this is what keeps the iOS
 * swipe-back returning to the *previous step* rather than jumping straight out
 * to the auth page. The flow state (entered values, created user id, Identomat
 * verification) lives here and is shared across those routes through
 * RegisterFlowProvider.
 */
export function useRegisterFlow() {
  const router = useRouter();
  const [formValues, setFormValues] = useState<RegisterPhysicalValues | null>(
    null,
  );
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [verificationUrl, setVerificationUrl] = useState<string | null>(null);
  const [verificationId, setVerificationId] = useState<number | null>(null);
  const [isCheckingVerification, setIsCheckingVerification] = useState(false);
  const [verificationResult, setVerificationResult] =
    useState<CheckVerificationResult | null>(null);

  const handleFormSubmit = useCallback(
    (values: RegisterPhysicalValues) => {
      if (isCreatingUser) return;
      // Remember the entered values so returning from OTP restores the form
      // instead of showing an empty one.
      setFormValues(values);
      setIsCreatingUser(true);
      createPortalUser(toCreatePortalUserPayload(values))
        .then((id) => {
          setUserId(id);
          router.push("/register/otp");
        })
        .catch((err: unknown) => {
          showErrorToast(mapRegisterError(err), err);
        })
        .finally(() => setIsCreatingUser(false));
    },
    [isCreatingUser, router],
  );

  const handleOtpVerify = useCallback(
    (code: string) => {
      if (isVerifyingOtp || userId === null) return;
      setIsVerifyingOtp(true);
      verifyPhoneOtp(userId, code)
        .then(({ verificationUrl: url, verificationId: vid }) => {
          setVerificationUrl(url);
          setVerificationId(vid);
          router.push("/register/identomat");
        })
        .catch(() => {
          showErrorToast(i18n.t("login.registerOtpGenericError"));
        })
        .finally(() => setIsVerifyingOtp(false));
    },
    [isVerifyingOtp, userId, router],
  );

  const handleIdentomatDone = useCallback(() => {
    if (isCheckingVerification || verificationId === null) return;
    // Keep the Identomat screen's loading overlay (and disabled back button) up
    // while we wait — the user can't leave until the check resolves.
    setIsCheckingVerification(true);

    // Whatever the check resolves to — approved, not-approved, or a backend
    // failure (e.g. 404 VERIFICATION_NOT_FOUND) — the user always lands on the
    // auth (login) page. Only the toast differs. Leaving them stuck on the
    // Identomat screen is never acceptable, so we clear the flow state and
    // redirect regardless of the outcome.
    const goToAuth = () => {
      setUserId(null);
      setVerificationUrl(null);
      setVerificationId(null);
      router.replace("/");
    };

    // The backend needs a short while to finish processing the Identomat result,
    // so give it a 10s head start before checking the verification status.
    setTimeout(() => {
      checkVerification(verificationId)
        .then((result) => {
          // The backend reports the Identomat outcome via `status`; only
          // APPROVED means the person is verified and registration is complete.
          // Any other status (STARTED / REJECTED / DATA_MISMATCH / CANCELLED)
          // is treated as a failed validation.
          if (result.status === "APPROVED") {
            setVerificationResult(result);
            showSuccessToast(i18n.t("login.registerStatusSuccess"));
          } else {
            showErrorToast(i18n.t("login.registerStatusFailed"));
          }
          goToAuth();
        })
        .catch((err: unknown) => {
          // The check request itself failed (e.g. the 404 backend error) —
          // still redirect, but flag it as a backend issue rather than a
          // validation failure.
          showErrorToast(i18n.t("login.registerStatusBackendError"), err);
          goToAuth();
        })
        .finally(() => setIsCheckingVerification(false));
    }, 10000);
  }, [isCheckingVerification, verificationId, router]);

  return {
    formValues,
    isCreatingUser,
    isVerifyingOtp,
    isCheckingVerification,
    verificationUrl,
    verificationResult,
    handleFormSubmit,
    handleOtpVerify,
    handleIdentomatDone,
  };
}

export type RegisterFlow = ReturnType<typeof useRegisterFlow>;
