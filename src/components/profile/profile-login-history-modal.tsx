import { useTranslation } from 'react-i18next';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { ModalBackdrop } from '@/components/ui/modal-backdrop';
import { useAppTheme } from '@/theme';
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
  const { colors, shadows } = useAppTheme();

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
          justifyContent: 'center',
          alignItems: 'center',
          padding: 16,
          backgroundColor: colors.overlay,
        }}>
        <View
          className="w-full max-w-[480px] gap-3 rounded-lg bg-surface p-4"
          style={shadows.lg}>
          <Text className="text-center text-heading font-bold text-fg">
            {t('loginHistory.modalTitle')}
          </Text>

          {entries.length === 0 ? (
            <Text className="py-3 text-center text-body text-fg-muted">
              {t('loginHistory.emptyMessage')}
            </Text>
          ) : (
            <ScrollView className="max-h-[360px]" showsVerticalScrollIndicator={false}>
              <View className="gap-2">
                {entries.map((entry, i) => (
                  <View
                    key={`${entry.date}-${i}`}
                    className="gap-1 rounded-sm border border-border p-2">
                    <View className="flex-row items-center justify-between gap-2">
                      <Text className="text-label font-semibold text-fg">
                        {formatDateTime(entry.date)}
                      </Text>
                      <Text
                        className={`overflow-hidden rounded-sm px-1 py-0.5 text-caption font-bold ${
                          entry.success
                            ? 'bg-success-subtle text-on-success'
                            : 'bg-danger-subtle text-on-danger'
                        }`}>
                        {entry.success
                          ? t('loginHistory.statusSuccess')
                          : t('loginHistory.statusFailed')}
                      </Text>
                    </View>
                    {entry.ipAddress ? (
                      <Text className="text-caption text-fg-muted">
                        {t('loginHistory.ipLabel')}: {entry.ipAddress}
                      </Text>
                    ) : null}
                    {entry.userAgent ? (
                      <Text className="text-caption text-fg-muted" numberOfLines={2}>
                        {t('loginHistory.deviceLabel')}: {entry.userAgent}
                      </Text>
                    ) : null}
                  </View>
                ))}
              </View>
            </ScrollView>
          )}

          <Pressable
            className="items-center rounded-sm bg-primary py-2 active:bg-primary-pressed"
            onPress={onClose}
            accessibilityRole="button">
            <Text className="text-body font-semibold text-on-primary">
              {t('passwordHistory.closeButton')}
            </Text>
          </Pressable>
        </View>
      </ModalBackdrop>
    </Modal>
  );
}
