import { useTranslation } from 'react-i18next';
import { Modal, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { useAppTheme } from '@/theme';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function PasswordResetNoticeModal({ visible, onClose }: Props) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <View className="flex-1 justify-center px-4" style={{ backgroundColor: colors.overlay }}>
        <View className="gap-3 rounded-md bg-surface p-4">
          <Text className="text-heading font-bold text-fg">
            {t('login.passwordResetNoticeTitle')}
          </Text>
          <Text className="text-body leading-[22px] text-fg">
            {t('login.passwordResetNoticeText')}
          </Text>
          <Button label={t('login.passwordResetNoticeButton')} onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}
