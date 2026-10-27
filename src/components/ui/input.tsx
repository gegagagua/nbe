import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useAppTheme } from '@/theme';
import type { InputProps } from '@/types/input';

const AnimatedText = Animated.createAnimatedComponent(Text);

export function Input({
  value,
  onChangeText,
  onBlur,
  onFocus,
  placeholder,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'none',
  errorMessage,
  otp,
  label,
  required,
  helperText,
  leftIcon,
  disabled,
  editable,
  maxLength,
  containerStyle,
  testID,
}: InputProps) {
  const { colors } = useAppTheme();
  const [hidden, setHidden] = useState(true);
  const [focused, setFocused] = useState(false);
  const isEditable = editable ?? !disabled;
  const floating = !!label;

  // Floating-label progress (0 = resting, 1 = raised). UI-thread transform only.
  const active = focused || value.length > 0;
  const progress = useSharedValue(active ? 1 : 0);
  useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, {
      duration: 160,
      easing: Easing.out(Easing.cubic),
    });
  }, [active, progress]);

  const labelStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [0, -11]) },
      { scale: interpolate(progress.value, [0, 1], [1, 0.82]) },
    ],
    color: interpolateColor(
      progress.value,
      [0, 1],
      [colors.inputPlaceholder, focused ? colors.accent : colors.textMuted],
    ),
  }));

  const handleChangeText = otp
    ? (text: string) => onChangeText(text.replace(/\D/g, ''))
    : onChangeText;

  const borderClass = errorMessage
    ? 'border-danger'
    : focused
      ? 'border-border-focus'
      : 'border-input-border';

  return (
    <View className="w-full gap-1" style={containerStyle}>
      {label && !floating ? (
        <View className="flex-row items-center gap-0.5">
          <Text className="text-label font-semibold text-fg-secondary">{label}</Text>
          {required ? <Text className="text-label font-semibold text-danger">*</Text> : null}
        </View>
      ) : null}

      <View
        className={[
          'w-full flex-row items-center rounded-md border px-3',
          floating ? 'min-h-[50px]' : 'min-h-[45px]',
          borderClass,
          focused && !errorMessage ? 'border-[1.5px]' : '',
          isEditable ? 'bg-input' : 'bg-surface-sunken',
        ].join(' ')}>
        {leftIcon ? (
          <MaterialCommunityIcons
            name={leftIcon}
            size={20}
            color={focused ? colors.accent : colors.textMuted}
            style={{ marginRight: 8 }}
          />
        ) : null}

        <View className="flex-1 justify-center">
          {floating ? (
            <AnimatedText
              pointerEvents="none"
              numberOfLines={1}
              className="absolute text-body font-medium origin-left"
              style={labelStyle}>
              {label}
              {required ? ' *' : ''}
            </AnimatedText>
          ) : null}
          <TextInput
            testID={testID}
            value={value}
            editable={isEditable}
            onChangeText={handleChangeText}
            onBlur={() => {
              setFocused(false);
              onBlur?.();
            }}
            onFocus={() => {
              setFocused(true);
              onFocus?.();
            }}
            placeholder={floating ? (focused ? placeholder : '') : placeholder}
            placeholderTextColor={colors.inputPlaceholder}
            secureTextEntry={secureTextEntry && hidden}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoCorrect={false}
            maxLength={maxLength}
            cursorColor={colors.accent}
            selectionColor={colors.accent}
            textContentType={otp ? 'oneTimeCode' : undefined}
            autoComplete={otp ? 'sms-otp' : undefined}
            importantForAutofill={otp ? 'yes' : undefined}
            className={`text-body text-fg py-2 ${floating ? 'pt-3' : ''}`}
            style={{ color: isEditable ? colors.inputText : colors.textMuted }}
          />
        </View>

        {secureTextEntry ? (
          <Pressable
            className="h-11 w-11 items-center justify-center -mr-2"
            onPress={() => setHidden((h) => !h)}
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}>
            <MaterialCommunityIcons
              name={hidden ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={colors.textMuted}
            />
          </Pressable>
        ) : null}
      </View>

      {errorMessage ? (
        <Text className="text-caption text-danger">{errorMessage}</Text>
      ) : helperText ? (
        <Text className="text-caption text-fg-muted">{helperText}</Text>
      ) : null}
    </View>
  );
}
