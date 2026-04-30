import { Controller } from "react-hook-form";
import { Pressable, Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoginCopy } from "@/constants/login-copy";
import type { LoginFormProps } from "@/types/login";

import { LoginBrandHeader } from "./login-brand-header";
import { loginFormStyles } from "./login-form.styles";

export function LoginForm({
  control,
  errors,
  onSubmit,
  submitDisabled,
  onRegisterPress,
  onGuestPress,
}: LoginFormProps) {
  return (
    <View style={loginFormStyles.card}>
      <LoginBrandHeader />
      <View style={loginFormStyles.fields}>
        <View style={loginFormStyles.fieldRow}>
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={LoginCopy.usernamePlaceholder}
                errorMessage={errors.username?.message}
              />
            )}
          />
          {errors.username?.message ? (
            <Text style={loginFormStyles.fieldError}>
              {errors.username.message}
            </Text>
          ) : null}
        </View>
        <View style={loginFormStyles.fieldRow}>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={LoginCopy.passwordPlaceholder}
                secureTextEntry
                errorMessage={errors.password?.message}
              />
            )}
          />
          {errors.password?.message ? (
            <Text style={loginFormStyles.fieldError}>
              {errors.password.message}
            </Text>
          ) : null}
        </View>
      </View>
      <Button
        label={LoginCopy.submit}
        onPress={() => void onSubmit()}
        disabled={submitDisabled}
      />
      <Pressable
        style={loginFormStyles.registerLink}
        onPress={onRegisterPress}
        accessibilityRole="link">
        <Text style={loginFormStyles.registerLinkText}>
          {LoginCopy.registrationLink}
        </Text>
      </Pressable>
      <Pressable style={loginFormStyles.guestLink} onPress={onGuestPress}>
        <Text style={loginFormStyles.guestLinkText}>{LoginCopy.guestLink}</Text>
      </Pressable>
    </View>
  );
}
