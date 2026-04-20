import Toast from 'react-native-toast-message';

import { ToastLayout } from '@/constants/toast';
import { logBackendError } from '@/lib/log-backend-error';

export function showErrorToast(message: string, error?: unknown) {
  if (error !== undefined) {
    logBackendError(error, 'toast');
  }
  Toast.show({
    type: 'error',
    text1: message,
    visibilityTime: ToastLayout.visibilityMs,
    position: 'top',
  });
}
