import { useMemo, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { ToastLayout } from '@/constants/toast';
import { useAppTheme } from '@/theme';

export function HomeChatScreen() {
  const { t, i18n } = useTranslation();
  const { colors } = useAppTheme();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const points = useMemo(
    () => t('homeTabs.chatPoints', { returnObjects: true }) as string[],
    [t, i18n.language],
  );

  const onStartChat = () => {
    Toast.show({
      type: 'info',
      text1: t('chatTab.startChatToast'),
      visibilityTime: ToastLayout.visibilityMs,
      position: 'top',
    });
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 16 + 16 : 0}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 56, paddingHorizontal: 16, gap: 16 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-title font-bold text-fg">{t('homeTabs.chatTitle')}</Text>

        <View className="gap-2 rounded-lg border border-border bg-surface p-4">
          <Text className="text-body-lg text-fg-secondary">{t('homeTabs.chatDescription')}</Text>
          {points.map((point) => (
            <View key={point} className="flex-row items-start gap-2">
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={20}
                color={colors.primary}
              />
              <Text className="flex-1 text-body-lg text-fg-secondary">{point}</Text>
            </View>
          ))}
        </View>

        <View className="gap-2 rounded-lg border border-border bg-surface p-4">
          <View className="gap-1">
            <Text className="text-label font-semibold text-fg">{t('chatTab.formSubjectLabel')}</Text>
            <TextInput
              value={subject}
              onChangeText={setSubject}
              placeholder={t('chatTab.formSubjectPlaceholder')}
              placeholderTextColor={colors.inputPlaceholder}
              className="min-h-[40px] w-full rounded-sm border border-input-border bg-input px-4 py-2 text-body text-fg"
              accessibilityLabel={t('chatTab.formSubjectLabel')}
            />
          </View>
          <View className="gap-1">
            <Text className="text-label font-semibold text-fg">{t('chatTab.formMessageLabel')}</Text>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder={t('chatTab.formMessagePlaceholder')}
              placeholderTextColor={colors.inputPlaceholder}
              className="min-h-[96px] w-full rounded-sm border border-input-border bg-input px-4 py-2 text-body text-fg"
              style={{ textAlignVertical: 'top' }}
              multiline
              accessibilityLabel={t('chatTab.formMessageLabel')}
            />
          </View>
          <View className="mt-1">
            <Button label={t('chatTab.startChatButton')} onPress={onStartChat} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
