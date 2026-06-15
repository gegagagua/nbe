import { useTranslation } from 'react-i18next';
import { Modal, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { LoginPalette } from '@/constants/login';
import { Radius, Space, Typography } from '@/constants/theme';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function PasswordResetNoticeModal({ visible, onClose }: Props) {
  const { t } = useTranslation();

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>{t('login.passwordResetNoticeTitle')}</Text>
          <Text style={styles.text}>{t('login.passwordResetNoticeText')}</Text>
          <Button label={t('login.passwordResetNoticeButton')} onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    paddingHorizontal: Space.large,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: Radius.medium,
    padding: Space.large,
    gap: Space.medium,
  },
  title: {
    fontSize: Typography.large,
    fontWeight: '700',
    color: LoginPalette.bodyText,
  },
  text: {
    fontSize: Typography.medium,
    color: LoginPalette.bodyText,
    lineHeight: 22,
  },
});
