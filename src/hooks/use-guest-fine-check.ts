import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { checkGuestFineDebt } from "@/api/guest-fine";
import { showErrorToast } from "@/lib/show-error-toast";
import type { GuestFineCheckFormValues } from "@/schemas/guest-fine-check.schema";
import type { GuestFineCheckResult } from "@/types/guest-fine";

export function useGuestFineCheck() {
  const { t } = useTranslation();
  const [result, setResult] = useState<GuestFineCheckResult | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: (values: GuestFineCheckFormValues) => {
      return checkGuestFineDebt({
        idNumber: values.idNumber.trim(),
        documentNumber: values.documentNumber.trim(),
      });
    },
    onSuccess: (data) => setResult(data),
    onError: () => {
      setResult(null);
      showErrorToast(t("cases.guestFine.checkError"));
    },
  });

  const handleCheck = useCallback(
    (values: GuestFineCheckFormValues) => {
      setResult(null);
      mutate(values);
    },
    [mutate],
  );

  const clearResult = useCallback(() => {
    setResult(null);
  }, []);

  return {
    result,
    handleCheck,
    clearResult,
    isChecking: isPending,
  };
}
