import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useEffect, useState } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { haptics } from '@/lib/haptics';
import { useAppTheme, Spring } from '@/theme';

const PAD = 6; // inner padding of the pill, px

/**
 * Floating glass tab bar with a spring-driven sliding indicator (transform
 * only, UI thread) and active-icon scale. Purely the visual layer — navigation
 * uses the standard emit/navigate contract, so routes are unchanged.
 */
export function BottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const t = useAppTheme();
  const { colors } = t;
  const insets = useSafeAreaInsets();
  const [barWidth, setBarWidth] = useState(0);

  const count = state.routes.length;
  const tabWidth = barWidth > 0 ? (barWidth - PAD * 2) / count : 0;

  const indicatorX = useSharedValue(0);
  useEffect(() => {
    indicatorX.value = withSpring(state.index * tabWidth, {
      damping: Spring.damping,
      stiffness: Spring.stiffness,
      mass: Spring.mass,
    });
  }, [state.index, tabWidth, indicatorX]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  return (
    <View
      pointerEvents="box-none"
      className="absolute inset-x-4"
      style={{ bottom: Math.max(insets.bottom, 10) }}>
      <View
        className="flex-row overflow-hidden rounded-2xl p-1.5"
        style={[t.shadows.lg, { backgroundColor: colors.tabBarBg }]}>
        <View className="flex-1 flex-row" onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}>
          {tabWidth > 0 ? (
            <Animated.View
              pointerEvents="none"
              className="absolute top-0 bottom-0 rounded-xl"
              style={[{ width: tabWidth, backgroundColor: colors.tabBarActiveBg }, indicatorStyle]}
            />
          ) : null}

          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label =
              typeof options.tabBarLabel === 'string'
                ? options.tabBarLabel
                : (options.title ?? route.name);
            const focused = state.index === index;
            const color = focused ? colors.tabBarActive : colors.tabBarInactive;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented) {
                haptics.select();
                navigation.navigate(route.name);
              }
            };

            return (
              <Pressable
                key={route.key}
                accessibilityRole="button"
                accessibilityState={focused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
                onPress={onPress}
                onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
                className="min-h-[48px] flex-1 items-center justify-center gap-0.5 py-1">
                <TabIcon focused={focused}>
                  {options.tabBarIcon?.({ focused, color, size: 24 })}
                </TabIcon>
                <Text
                  numberOfLines={1}
                  className="text-[11px] tracking-[0.1px]"
                  style={{ color, fontWeight: focused ? '700' : '500' }}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

/** Scales the active tab icon with a spring (UI thread). */
function TabIcon({ focused, children }: { focused: boolean; children: React.ReactNode }) {
  const scale = useSharedValue(focused ? 1.1 : 1);
  useEffect(() => {
    scale.value = withSpring(focused ? 1.1 : 1, { damping: 14, stiffness: 240 });
  }, [focused, scale]);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return <Animated.View style={style}>{children}</Animated.View>;
}

/** Height a scene should reserve so content clears the floating bar. */
export const BOTTOM_TAB_SPACE = Platform.select({ ios: 96, android: 100 }) ?? 96;
