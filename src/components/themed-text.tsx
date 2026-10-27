import { Platform, Text, type TextProps } from 'react-native';

import { Fonts, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'subtitle' | 'link' | 'linkPrimary' | 'code';
  themeColor?: ThemeColor;
  className?: string;
};

const VARIANT: Record<NonNullable<ThemedTextProps['type']>, string> = {
  default: 'text-[16px] leading-6 font-medium',
  title: 'text-[48px] leading-[52px] font-semibold',
  small: 'text-[14px] leading-5 font-medium',
  smallBold: 'text-[14px] leading-5 font-bold',
  subtitle: 'text-[32px] leading-[44px] font-semibold',
  link: 'text-[14px] leading-[30px]',
  linkPrimary: 'text-[14px] leading-[30px]',
  code: 'text-[12px]',
};

export function ThemedText({ style, type = 'default', themeColor, className, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      className={`${VARIANT[type]} ${className ?? ''}`}
      style={[
        { color: theme[themeColor ?? 'text'] },
        type === 'linkPrimary' && { color: '#3c87f7' },
        type === 'code' && {
          fontFamily: Fonts.mono,
          fontWeight: Platform.select({ android: '700' as const }) ?? ('500' as const),
        },
        style,
      ]}
      {...rest}
    />
  );
}
