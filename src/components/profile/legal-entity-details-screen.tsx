import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { updateLegalEntity } from "@/api/users";
import { AppHeader } from "@/components/ui/app-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLegalEntities } from "@/hooks/use-legal-entities";
import { setActiveLegalEntity } from "@/lib/active-legal-entity-storage";
import { showErrorToast } from "@/lib/show-error-toast";
import { showSuccessToast } from "@/lib/show-success-toast";
import {
  createLegalEntityDetailsSchema,
  type LegalEntityDetailsValues,
} from "@/schemas/legal-entity-details.schema";
import { useAppTheme } from "@/theme";

/**
 * Shown after the user picks a legal entity in the account switcher. The
 * actual address is required before acting as the entity; email is optional.
 */
export function LegalEntityDetailsScreen() {
  const { t, i18n } = useTranslation();
  const { colors } = useAppTheme();
  const { id, mode } = useLocalSearchParams<{ id: string; mode?: string }>();
  const entityId = Number(id);
  // Opened from "edit" on the profile: start from the saved values. The switch
  // flow starts empty so the user enters the details themselves.
  const isEdit = mode === "edit";
  const legalEntities = useLegalEntities();
  const { refetch } = legalEntities;
  const [isSaving, setIsSaving] = useState(false);

  const entity = legalEntities.entities.find((e) => e.id === entityId) ?? null;

  const schema = useMemo(
    () => createLegalEntityDetailsSchema(t),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, i18n.language],
  );
  const { control, handleSubmit, formState, reset } =
    useForm<LegalEntityDetailsValues>({
      resolver: zodResolver(schema),
      mode: "onChange",
      defaultValues: { realAddress: "", email: "" },
    });

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (isEdit && entity) {
      reset({
        realAddress: entity.realAddress?.trim() ?? "",
        email: entity.email?.trim() ?? "",
      });
    }
  }, [isEdit, entity, reset]);

  const onSubmit = handleSubmit(async (values) => {
    if (!entity) return;
    const payload = {
      realAddress: values.realAddress.trim(),
      email: values.email.trim() || null,
    };
    setIsSaving(true);
    try {
      await updateLegalEntity(entity.id, payload);
      await setActiveLegalEntity({ ...entity, ...payload });
      showSuccessToast(
        isEdit ? t("profile.saveSuccess") : t("legalEntity.saveSuccess"),
      );
      router.back();
    } catch (err: unknown) {
      showErrorToast(t("profile.saveError"), err);
    } finally {
      setIsSaving(false);
    }
  }, (errors) => {
    // The button stays tappable so the user is told which field is missing.
    const message = errors.realAddress?.message ?? errors.email?.message;
    if (message) showErrorToast(message);
  });

  return (
    <View className="flex-1 bg-bg">
      <AppHeader title={t("login.registerTabLegal")} />

      {legalEntities.isLoading && !entity ? (
        <ActivityIndicator
          className="mt-8"
          size="large"
          color={colors.primary}
        />
      ) : !entity ? (
        <Text className="mt-8 text-center text-label font-semibold text-danger">
          {t("legalEntity.notFound")}
        </Text>
      ) : (
        <KeyboardAwareScrollView
          className="flex-1"
          contentContainerClassName="gap-4 px-4 py-4 pb-10"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bottomOffset={16}
        >
          <Card padding="lg" elevation="sm" className="gap-4 rounded-2xl">
            <Text className="text-heading font-bold text-fg">{entity.name}</Text>
            {!isEdit && (
              <Text className="text-label font-semibold uppercase tracking-wide text-fg-muted">
                {t("legalEntity.description")}
              </Text>
            )}

            <View className="gap-2">
              <View className="gap-1">
                <Text className="text-label font-semibold uppercase tracking-wide text-fg-muted">
                  {t("profile.labelRealAddress")} *
                </Text>
                <Controller
                  control={control}
                  name="realAddress"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder={t("profile.labelRealAddress")}
                      autoCapitalize="sentences"
                      errorMessage={formState.errors.realAddress?.message}
                    />
                  )}
                />
              </View>

              <View className="gap-1">
                <Text className="text-label font-semibold uppercase tracking-wide text-fg-muted">
                  {t("profile.labelEmail")}
                </Text>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder={t("profile.labelEmail")}
                      keyboardType="email-address"
                      errorMessage={formState.errors.email?.message}
                    />
                  )}
                />
              </View>
            </View>

            <Button
              label={isEdit ? t("profile.saveButton") : t("legalEntity.saveButton")}
              onPress={() => {
                onSubmit();
              }}
              disabled={isSaving}
            />
          </Card>
        </KeyboardAwareScrollView>
      )}
    </View>
  );
}
