import Toast from 'react-native-toast-message';

import { ToastLayout } from '@/constants/toast';

export function showSuccessToast(message: string) {
  Toast.show({
    type: 'success',
    text1: message,
    visibilityTime: ToastLayout.visibilityMs,
    position: 'top',
  });
}
