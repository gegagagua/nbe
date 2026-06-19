import { useCallback, useState } from "react";

import { checkVerification, createPortalUser, verifyPhoneOtp } from "@/api/users";
import i18n from "@/i18n/i18n";
import { mapRegisterError } from "@/lib/map-register-error";
import { normalizeGeorgianPhone } from "@/lib/phone";
import { showErrorToast } from "@/lib/show-error-toast";
import type { RegisterPhysicalValues } from "@/types/register-form-values";

export type RegisterFlowStep = "form" | "otp" | "identomat" | "success";

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

export function useRegisterFlow() {
  const [step, setStep] = useState<RegisterFlowStep>("form");
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [verificationUrl, setVerificationUrl] = useState<string | null>(null);
  const [verificationId, setVerificationId] = useState<number | null>(null);
  const [isCheckingVerification, setIsCheckingVerification] = useState(false);

  const handleFormSubmit = useCallback(
    (values: RegisterPhysicalValues) => {
      if (isCreatingUser) return;
      setIsCreatingUser(true);
      createPortalUser(toCreatePortalUserPayload(values))
        .then((id) => {
          setUserId(id);
          setStep("otp");
        })
        .catch((err: unknown) => {
          showErrorToast(mapRegisterError(err), err);
        })
        .finally(() => setIsCreatingUser(false));
    },
    [isCreatingUser],
  );

  const handleOtpVerify = useCallback(
    (code: string) => {
      if (isVerifyingOtp || userId === null) return;
      setIsVerifyingOtp(true);
      verifyPhoneOtp(userId, code)
        .then(({ verificationUrl: url, verificationId: vid }) => {
          setVerificationUrl(url);
          setVerificationId(vid);
          setStep("identomat");
        })
        .catch(() => {
          showErrorToast(i18n.t("login.registerOtpGenericError"));
        })
        .finally(() => setIsVerifyingOtp(false));
    },
    [isVerifyingOtp, userId],
  );

  const handleOtpBack = useCallback(() => {
    setStep("form");
    setUserId(null);
  }, []);

  const handleIdentomatDone = useCallback(() => {
    if (isCheckingVerification || verificationId === null) return;
    setIsCheckingVerification(true);
    checkVerification(verificationId)
      .then(() => setStep("success"))
      .catch(() => {
        showErrorToast(i18n.t("login.registerOtpGenericError"));
      })
      .finally(() => setIsCheckingVerification(false));
  }, [isCheckingVerification, verificationId]);

  // Backing out of identomat returns to the OTP step without running the
  // verification check, so success is only reached via handleIdentomatDone.
  const handleIdentomatBack = useCallback(() => {
    if (isCheckingVerification) return;
    setStep("otp");
    setVerificationUrl(null);
    setVerificationId(null);
  }, [isCheckingVerification]);

  return {
    step,
    isCreatingUser,
    isVerifyingOtp,
    isCheckingVerification,
    verificationUrl,
    handleFormSubmit,
    handleOtpVerify,
    handleOtpBack,
    handleIdentomatDone,
    handleIdentomatBack,
  };
}
