import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { useAppTheme } from '@/theme';

const GLASS = isLiquidGlassAvailable();

export type GlassSurfaceProps = {
  children?: React.ReactNode;
  /** NativeWind classes (layout, radius, padding, border). */
  className?: string;
  style?: StyleProp<ViewStyle>;
  /** 'regular' frosted (default) or 'clear' lighter effect (iOS only). */
  glass?: 'regular' | 'clear';
  testID?: string;
};

/**
 * Civic Glass surface. On iOS 26+ (Liquid Glass) it renders a true frosted
 * GlassView; everywhere else it falls back to a translucent solid surface so
 * Android never pays the GPU blur cost (protects 60fps). Callers style it the
 * same way via className regardless of platform.
 */
export function GlassSurface({ children, className, style, glass = 'regular', testID }: GlassSurfaceProps) {
  const { isDark } = useAppTheme();

  if (GLASS) {
    return (
      <GlassView
        testID={testID}
        glassEffectStyle={glass}
        colorScheme={isDark ? 'dark' : 'light'}
        className={className}
        style={style}>
        {children}
      </GlassView>
    );
  }

  // Fallback: high-opacity translucent surface (no blur → cheap on Android).
  return (
    <View testID={testID} className={`bg-surface/[0.92] ${className ?? ''}`} style={style}>
      {children}
    </View>
  );
}
