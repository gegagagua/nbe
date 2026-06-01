import Toast, { ErrorToast } from 'react-native-toast-message';

import { ToastLayout } from '@/constants/toast';

const toastConfig = {
  error: (props: React.ComponentProps<typeof ErrorToast>) => (
    <ErrorToast {...props} text1NumberOfLines={4} />
  ),
};

export function AppToast() {
  return <Toast position="top" topOffset={ToastLayout.topOffset} config={toastConfig} />;
}
