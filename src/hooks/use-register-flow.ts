import { useCallback, useState } from "react";

import { createPortalUser } from "@/api/users";
import { mapRegisterError } from "@/lib/map-register-error";
import { showErrorToast } from "@/lib/show-error-toast";
import type { RegisterPhysicalValues } from "@/types/register-form-values";

export type RegisterFlowStep = "form" | "success";

function toCreatePortalUserPayload(values: RegisterPhysicalValues) {
  return {
    idnumber: values.personalId,
    mobile: values.phone,
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

  const handleFormSubmit = useCallback(
    (values: RegisterPhysicalValues) => {
      if (isCreatingUser) return;
      setIsCreatingUser(true);
      console.log("values", values);
      createPortalUser(toCreatePortalUserPayload(values))
        .then(() => setStep("success"))
        .catch((err: unknown) => {
          showErrorToast(mapRegisterError(err), err);
        })
        .finally(() => setIsCreatingUser(false));
    },
    [isCreatingUser],
  );

  return {
    step,
    isCreatingUser,
    handleFormSubmit,
  };
}
