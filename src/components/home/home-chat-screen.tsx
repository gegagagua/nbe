import { useMemo, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { HomeTabsLayout, HomeTabsPalette } from '@/constants/home-tabs';
import { LoginPalette } from '@/constants/login';
import { ToastLayout } from '@/constants/toast';
import { Spacing } from '@/constants/theme';

import { homeChatScreenStyles as s } from './home-chat-screen.styles';

export function HomeChatScreen() {
  const { t, i18n } = useTranslation();
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
      style={s.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? HomeTabsLayout.contentTopPad + Spacing.three : 0}
    >
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={s.screenTitle}>{t('homeTabs.chatTitle')}</Text>

        <View style={s.card}>
          <Text style={s.introDescription}>{t('homeTabs.chatDescription')}</Text>
          {points.map((point) => (
            <View key={point} style={s.pointRow}>
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={HomeTabsLayout.iconSize}
                color={HomeTabsPalette.activeBg}
              />
              <Text style={s.pointText}>{point}</Text>
            </View>
          ))}
        </View>

        <View style={s.formCard}>
          <View style={s.fieldBlock}>
            <Text style={s.fieldLabel}>{t('chatTab.formSubjectLabel')}</Text>
            <TextInput
              value={subject}
              onChangeText={setSubject}
              placeholder={t('chatTab.formSubjectPlaceholder')}
              placeholderTextColor={LoginPalette.placeholderMuted}
              style={s.fieldInput}
              accessibilityLabel={t('chatTab.formSubjectLabel')}
            />
          </View>
          <View style={s.fieldBlock}>
            <Text style={s.fieldLabel}>{t('chatTab.formMessageLabel')}</Text>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder={t('chatTab.formMessagePlaceholder')}
              placeholderTextColor={LoginPalette.placeholderMuted}
              style={[s.fieldInput, s.fieldInputMultiline]}
              multiline
              accessibilityLabel={t('chatTab.formMessageLabel')}
            />
          </View>
          <View style={s.formButtonWrap}>
            <Button label={t('chatTab.startChatButton')} onPress={onStartChat} />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
