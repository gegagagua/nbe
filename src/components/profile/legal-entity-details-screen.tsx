import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { updateLegalEntity } from "@/api/users";
import { AppSafeArea } from "@/components/ui/app-safe-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoginPalette } from "@/constants/login";
import { useLegalEntities } from "@/hooks/use-legal-entities";
import { setActiveLegalEntity } from "@/lib/active-legal-entity-storage";
import { showErrorToast } from "@/lib/show-error-toast";
import { showSuccessToast } from "@/lib/show-success-toast";
import {
  createLegalEntityDetailsSchema,
  type LegalEntityDetailsValues,
} from "@/schemas/legal-entity-details.schema";

import { profileScreenStyles as s } from "./profile-screen.styles";

/**
 * Shown after the user picks a legal entity in the account switcher. The
 * actual address is required before acting as the entity; email is optional.
 */
export function LegalEntityDetailsScreen() {
  const { t, i18n } = useTranslation();
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
          <Text style={s.pageTitle}>{t("login.registerTabLegal")}</Text>
        </View>

        {legalEntities.isLoading && !entity ? (
          <ActivityIndicator
            style={{ marginTop: 32 }}
            size="large"
            color={LoginPalette.primary}
          />
        ) : !entity ? (
          <Text style={[s.statusMessage, s.statusError, { marginTop: 32 }]}>
            {t("legalEntity.notFound")}
          </Text>
        ) : (
          <KeyboardAwareScrollView
            style={s.scroll}
            contentContainerStyle={s.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bottomOffset={16}
          >
            <View style={s.card}>
              <Text style={s.sectionTitle}>{entity.name}</Text>
              {!isEdit && (
                <Text style={s.label}>{t("legalEntity.description")}</Text>
              )}

              <View style={s.fieldGroup}>
                <View style={s.fieldRow}>
                  <Text style={s.label}>
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

                <View style={s.fieldRow}>
                  <Text style={s.label}>{t("profile.labelEmail")}</Text>
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
            </View>
          </KeyboardAwareScrollView>
        )}
      </AppSafeArea>
    </View>
  );
}
