import Toast from 'react-native-toast-message';

import { ToastLayout } from '@/constants/toast';

export function AppToast() {
  return <Toast position="top" topOffset={ToastLayout.topOffset} />;
}
