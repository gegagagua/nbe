import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ModalBackdrop } from '@/components/ui/modal-backdrop';
import { LoginPalette } from '@/constants/login';
import { Radius, Space, Typography } from '@/constants/theme';
import { getPasswordHistory, type PasswordHistoryEntry } from '@/lib/password-history-storage';

type PasswordHistoryModalProps = {
  visible: boolean;
  onClose: () => void;
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${hh}:${min}:${ss}`;
}

export function PasswordHistoryModal({ visible, onClose }: PasswordHistoryModalProps) {
  const { t } = useTranslation();
  const [history, setHistory] = useState<PasswordHistoryEntry[]>([]);

  useEffect(() => {
    if (visible) {
      getPasswordHistory().then(setHistory).catch(() => setHistory([]));
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent>
      <ModalBackdrop onClose={onClose} style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>{t('passwordHistory.modalTitle')}</Text>

          {history.length === 0 ? (
            <Text style={styles.emptyText}>{t('passwordHistory.emptyMessage')}</Text>
          ) : (
            <ScrollView style={styles.tableScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.tableHeader}>
                <Text style={[styles.headerCell, styles.colLabel]}>
                  {t('passwordHistory.lastChange')}
                </Text>
                <Text style={[styles.headerCell, styles.colDate]}>
                  {t('passwordHistory.tableHeaderDate')}
                </Text>
                <Text style={[styles.headerCell, styles.colTime]}>
                  {t('passwordHistory.tableHeaderTime')}
                </Text>
              </View>
              {history.map((entry, i) => (
                <View key={entry.hash + i} style={[styles.tableRow, i % 2 === 0 && styles.tableRowAlt]}>
                  <Text style={[styles.cell, styles.colLabel]}>#{i + 1}</Text>
                  <Text style={[styles.cell, styles.colDate]}>{formatDate(entry.changedAt)}</Text>
                  <Text style={[styles.cell, styles.colTime]}>{formatTime(entry.changedAt)}</Text>
                </View>
              ))}
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
  tableScroll: {
    maxHeight: 240,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: LoginPalette.inputBorder,
    paddingBottom: Space.extraSmall,
    marginBottom: Space.extraSmall,
  },
  headerCell: {
    fontSize: Typography.small,
    fontWeight: '700',
    color: LoginPalette.bodyText,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: Space.extraSmall,
  },
  tableRowAlt: {
    backgroundColor: '#f5f7fa',
  },
  cell: {
    fontSize: Typography.small,
    color: LoginPalette.bodyText,
  },
  colLabel: {
    flex: 1,
  },
  colDate: {
    width: 90,
    textAlign: 'center',
  },
  colTime: {
    width: 80,
    textAlign: 'center',
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
