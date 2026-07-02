import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { createRegisterPhysicalSchema } from "@/schemas/register-physical.schema";
import type { RegisterPhysicalValues } from "@/types/register-form-values";

const defaultValues: RegisterPhysicalValues = {
  personalId: "",
  actualAddress: "",
  phone: "",
  password: "",
  confirmPassword: "",
  legalAddress: "",
  email: "",
};

export function useRegisterPhysicalForm(
  onValidSubmit: (values: RegisterPhysicalValues) => void,
  initialValues?: RegisterPhysicalValues | null,
) {
  const { t, i18n } = useTranslation();
  const schema = useMemo(
    () => createRegisterPhysicalSchema(t),
    [t, i18n.language],
  );

  const { control, handleSubmit, formState } = useForm<RegisterPhysicalValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: initialValues ?? defaultValues,
  });

  const onSubmit = handleSubmit((values) => onValidSubmit(values));

  return {
    control,
    onSubmit,
    submitDisabled: !formState.isValid,
  };
}
