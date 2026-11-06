import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ModalBackdrop } from '@/components/ui/modal-backdrop';
import { useAppTheme } from '@/theme';
import { getPasswordHistory, type PasswordHistoryEntry } from '@/lib/password-history-storage';
import type { PasswordHistoryApiEntry } from '@/types/users';

type PasswordHistoryModalProps = {
  visible: boolean;
  onClose: () => void;
  apiEntries?: PasswordHistoryApiEntry[];
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

type Row = { changedAt: string; key: string };

export function PasswordHistoryModal({ visible, onClose, apiEntries }: PasswordHistoryModalProps) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const [history, setHistory] = useState<PasswordHistoryEntry[]>([]);

  useEffect(() => {
    if (visible && !apiEntries) {
      getPasswordHistory().then(setHistory).catch(() => setHistory([]));
    }
  }, [visible, apiEntries]);

  const rows: Row[] = apiEntries
    ? apiEntries.map((e, i) => ({ changedAt: e.date, key: `${e.date}-${i}` }))
    : history.map((e, i) => ({ changedAt: e.changedAt, key: e.hash + i }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent>
      <ModalBackdrop
        onClose={onClose}
        style={{
          flex: 1,
          backgroundColor: colors.overlay,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 24,
        }}>
        <View className="w-full max-w-[480px] gap-4 rounded-lg bg-surface p-6">
          <Text className="text-center text-body-lg font-bold text-fg">
            {t('passwordHistory.modalTitle')}
          </Text>

          {rows.length === 0 ? (
            <Text className="py-4 text-center text-body text-fg-muted">
              {t('passwordHistory.emptyMessage')}
            </Text>
          ) : (
            <ScrollView style={{ maxHeight: 240 }} showsVerticalScrollIndicator={false}>
              <View className="mb-1 flex-row border-b border-border pb-1">
                <Text className="flex-1 text-label font-bold text-fg-secondary">
                  {t('passwordHistory.lastChange')}
                </Text>
                <Text className="w-[90px] text-center text-label font-bold text-fg-secondary">
                  {t('passwordHistory.tableHeaderDate')}
                </Text>
                <Text className="w-[80px] text-center text-label font-bold text-fg-secondary">
                  {t('passwordHistory.tableHeaderTime')}
                </Text>
              </View>
              {rows.map((row, i) => (
                <View
                  key={row.key}
                  className={`flex-row py-1 ${i % 2 === 0 ? 'bg-surface-sunken' : ''}`}>
                  <Text className="flex-1 text-label text-fg-secondary">#{i + 1}</Text>
                  <Text className="w-[90px] text-center text-label text-fg-secondary">
                    {formatDate(row.changedAt)}
                  </Text>
                  <Text className="w-[80px] text-center text-label text-fg-secondary">
                    {formatTime(row.changedAt)}
                  </Text>
                </View>
              ))}
            </ScrollView>
          )}

          <Button label={t('passwordHistory.closeButton')} onPress={onClose} />
        </View>
      </ModalBackdrop>
    </Modal>
  );
}
