import { useState } from 'react';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { mockPushNotification } from '@/constants/mock-notification';
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
    <View className="mx-4 mt-4">
      <Button
        label="test push"
        onPress={onPress}
        disabled={busy}
        leftIcon="bell-ring-outline"
        accessibilityLabel="ტესტ შეტყობინების გამოგზავნა"
      />
    </View>
  );
}
