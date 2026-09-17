import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { mockPushNotification } from '@/constants/mock-notification';
import { LoginInteraction, LoginPalette } from '@/constants/login';
import { Radius, Space } from '@/constants/theme';
import { showErrorToast } from '@/lib/show-error-toast';
import { showSuccessToast } from '@/lib/show-success-toast';
import { sendTestNotification } from '@/lib/push-notifications';

/**
 * Dev/demo button that fires an immediate local push notification built from
 * {@link mockPushNotification}, so you can see how a real feed notification
 * would arrive on the device.
 */
export function TestPushButton() {
  const [busy, setBusy] = useState(false);

  const onPress = async () => {
    if (busy) {
      return;
    }
    setBusy(true);
    try {
      const sent = await sendTestNotification(mockPushNotification);
      if (sent) {
        showSuccessToast('ტესტ შეტყობინება გამოგზავნილია');
      } else {
        showErrorToast('შეტყობინების ნებართვა არ არის მიცემული');
      }
    } catch (error) {
      showErrorToast('შეტყობინების გამოგზავნა ვერ მოხერხდა', error);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={busy}
      accessibilityRole="button"
      accessibilityLabel="ტესტ შეტყობინების გამოგზავნა"
      style={({ pressed }) => [
        styles.button,
        pressed ? { opacity: LoginInteraction.pressedOpacity } : null,
        busy ? styles.buttonDisabled : null,
      ]}
    >
      <MaterialCommunityIcons name="bell-ring-outline" size={20} color={LoginPalette.onPrimary} />
      <Text style={styles.label}>test push</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Space.small,
    backgroundColor: LoginPalette.primary,
    paddingVertical: Space.medium,
    paddingHorizontal: Space.large,
    borderRadius: Radius.small,
    marginTop: Space.medium,
    marginHorizontal: Space.medium,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  label: {
    color: LoginPalette.onPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});
