import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, Text, View } from 'react-native';

import { PressableScale } from '@/components/ui/pressable-scale';
import { useAppTheme } from '@/theme';
import type { ButtonProps, ButtonSize, ButtonVariant } from '@/types/button';

const VARIANT: Record<ButtonVariant, { box: string; label: string; fg: (c: any) => string }> = {
  primary: {
    box: 'bg-primary active:bg-primary-pressed',
    label: 'text-on-primary',
    fg: (c) => c.onPrimary,
  },
  secondary: {
    box: 'bg-surface border border-border-strong active:bg-surface-pressed',
    label: 'text-primary',
    fg: (c) => c.primary,
  },
  ghost: {
    box: 'bg-transparent active:bg-surface-pressed',
    label: 'text-primary',
    fg: (c) => c.primary,
  },
  destructive: {
    box: 'bg-danger active:bg-danger-pressed',
    label: 'text-on-danger',
    fg: (c) => c.onDanger,
  },
};

const SIZE: Record<ButtonSize, { box: string; label: string; icon: number }> = {
  sm: { box: 'min-h-[36px] px-3.5 gap-1.5', label: 'text-[14px]', icon: 17 },
  md: { box: 'min-h-[45px] px-5 gap-2', label: 'text-[15px]', icon: 18 },
  lg: { box: 'min-h-[50px] px-6 gap-2.5', label: 'text-[16px]', icon: 19 },
};

export function Button({
  label,
  onPress,
  disabled = false,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = true,
  leftIcon,
  rightIcon,
  haptic = true,
  style,
  labelStyle,
  accessibilityLabel,
  testID,
}: ButtonProps) {
  const { colors } = useAppTheme();
  const v = VARIANT[variant];
  const s = SIZE[size];
  const isDisabled = disabled || loading;
  const fg = v.fg(colors);

  return (
    <PressableScale
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      haptic={haptic ? (variant === 'destructive' ? 'heavy' : 'tap') : 'none'}
      onPress={onPress}
      className={[
        'flex-row items-center justify-center rounded-lg',
        v.box,
        s.box,
        fullWidth ? 'w-full self-stretch' : 'self-start',
        isDisabled ? 'opacity-40' : '',
      ].join(' ')}
      style={style}>
      {loading ? (
        <ActivityIndicator color={fg} size="small" />
      ) : (
        <>
          {leftIcon ? <MaterialCommunityIcons name={leftIcon} size={s.icon} color={fg} /> : null}
          <Text
            numberOfLines={1}
            className={`font-semibold tracking-[0.1px] ${v.label} ${s.label}`}
            style={labelStyle}>
            {label}
          </Text>
          {rightIcon ? <MaterialCommunityIcons name={rightIcon} size={s.icon} color={fg} /> : null}
        </>
      )}
    </PressableScale>
  );
}
