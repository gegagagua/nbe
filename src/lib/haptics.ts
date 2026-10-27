/**
 * Thin, safe wrapper around expo-haptics.
 *
 * - No-ops on web (expo-haptics is native-only) so callers never need to guard.
 * - Swallows errors (haptics are best-effort, never block an interaction).
 * - Use the semantic helpers (`haptics.tap`, `haptics.success`, …) so the
 *   feedback vocabulary stays consistent across the app.
 */

import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

const enabled = Platform.OS === 'ios' || Platform.OS === 'android';

function run(fn: () => Promise<void>) {
  if (!enabled) return;
  fn().catch(() => {
    // best-effort; ignore devices without a haptics engine
  });
}

export const haptics = {
  /** Light tick — primary button press, tab switch. */
  tap: () => run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  /** Medium tap — toggles, selection commits. */
  select: () => run(() => Haptics.selectionAsync()),
  /** Heavier tap — destructive / important confirmations. */
  heavy: () => run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)),
  /** Success notification — completed submit / payment. */
  success: () => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
  /** Warning notification. */
  warning: () => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)),
  /** Error notification — failed validation / request. */
  error: () => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)),
};
