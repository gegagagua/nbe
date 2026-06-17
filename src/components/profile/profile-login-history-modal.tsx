import { useTranslation } from 'react-i18next';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ModalBackdrop } from '@/components/ui/modal-backdrop';
import { LoginPalette } from '@/constants/login';
import { Radius, Space, Typography } from '@/constants/theme';
import type { LoginHistoryEntry } from '@/types/users';

type Props = {
  visible: boolean;
  entries: LoginHistoryEntry[];
  onClose: () => void;
};

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${dd}.${mm}.${yyyy} ${hh}:${min}:${ss}`;
}

export function ProfileLoginHistoryModal({ visible, entries, onClose }: Props) {
  const { t } = useTranslation();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent>
      <ModalBackdrop onClose={onClose} style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>{t('loginHistory.modalTitle')}</Text>

          {entries.length === 0 ? (
            <Text style={styles.emptyText}>{t('loginHistory.emptyMessage')}</Text>
          ) : (
            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
              <View style={{ gap: Space.small }}>
                {entries.map((entry, i) => (
                  <View key={`${entry.date}-${i}`} style={styles.row}>
                    <View style={styles.rowHeader}>
                      <Text style={styles.dateText}>{formatDateTime(entry.date)}</Text>
                      <Text
                        style={[
                          styles.statusBadge,
                          entry.success ? styles.statusSuccess : styles.statusFail,
                        ]}>
                        {entry.success
                          ? t('loginHistory.statusSuccess')
                          : t('loginHistory.statusFailed')}
                      </Text>
                    </View>
                    {entry.ipAddress ? (
                      <Text style={styles.metaText}>
                        {t('loginHistory.ipLabel')}: {entry.ipAddress}
                      </Text>
                    ) : null}
                    {entry.userAgent ? (
                      <Text style={styles.metaText} numberOfLines={2}>
                        {t('loginHistory.deviceLabel')}: {entry.userAgent}
                      </Text>
                    ) : null}
                  </View>
                ))}
              </View>
            </ScrollView>
          )}

          <Pressable style={styles.closeButton} onPress={onClose} accessibilityRole="button">
            <Text style={styles.closeButtonText}>{t('passwordHistory.closeButton')}</Text>
          </Pressable>
        </View>
      </ModalBackdrop>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Space.large,
  },
  sheet: {
    backgroundColor: '#ffffff',
    borderRadius: Radius.large,
    padding: Space.large,
    width: '100%',
    maxWidth: 480,
    gap: Space.medium,
  },
  title: {
    fontSize: Typography.large,
    fontWeight: '700',
    color: LoginPalette.titleText,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: Typography.medium,
    color: LoginPalette.placeholderMuted,
    textAlign: 'center',
    paddingVertical: Space.medium,
  },
  scroll: {
    maxHeight: 360,
  },
  row: {
    borderWidth: 1,
    borderColor: LoginPalette.inputBorder,
    borderRadius: Radius.small,
    padding: Space.small,
    gap: 4,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Space.small,
  },
  dateText: {
    fontSize: Typography.small,
    fontWeight: '600',
    color: LoginPalette.bodyText,
  },
  statusBadge: {
    fontSize: Typography.extraSmall,
    fontWeight: '700',
    paddingVertical: 2,
    paddingHorizontal: Space.extraSmall,
    borderRadius: Radius.small,
    overflow: 'hidden',
  },
  statusSuccess: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  statusFail: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
  },
  metaText: {
    fontSize: Typography.extraSmall,
    color: LoginPalette.placeholderMuted,
  },
  closeButton: {
    backgroundColor: LoginPalette.primary,
    borderRadius: Radius.small,
    paddingVertical: Space.small,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: Typography.medium,
    fontWeight: '600',
  },
});
