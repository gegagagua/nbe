import type { ComponentProps, ReactNode } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { NbeContactLinks, NbeContactMailto, NbeContactPhoneRows } from '@/constants/nbe-contact-links';
import { useAppTheme } from '@/theme';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

function openUrl(href: string) {
  Linking.openURL(href);
}

function ContactCard({ iconName, title, children }: { iconName: IconName; title: string; children: ReactNode }) {
  const { colors } = useAppTheme();
  return (
    <View className="gap-2 rounded-lg border border-border bg-surface p-4">
      <View className="flex-row items-center gap-2">
        <MaterialCommunityIcons name={iconName} size={20} color={colors.primary} />
        <Text className="flex-1 text-body-lg font-semibold text-fg">{title}</Text>
      </View>
      {children}
    </View>
  );
}

export function HomeContactScreen() {
  const { t } = useTranslation();

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingTop: 16, paddingBottom: 24, paddingHorizontal: 16, gap: 16 }}>
      <Text className="text-title font-bold text-fg">{t('contactTab.screenTitle')}</Text>

      <ContactCard iconName="phone" title={t('contactTab.phoneCardTitle')}>
        <View className="gap-4">
          {NbeContactPhoneRows.map((row, index) => (
            <View key={row.tel} className="gap-0.5">
              <Text className="text-label text-fg-secondary">{t(row.labelKey)}</Text>
              <Pressable onPress={() => openUrl(row.tel)} className="self-start" accessibilityRole="link">
                <Text
                  className={
                    index === 0
                      ? 'text-title font-bold text-primary'
                      : 'text-body-lg font-semibold text-primary underline'
                  }>
                  {t(row.valueKey)}
                </Text>
              </Pressable>
            </View>
          ))}
        </View>
      </ContactCard>

      <ContactCard iconName="email-outline" title={t('contactTab.emailCardTitle')}>
        <Pressable onPress={() => openUrl(NbeContactMailto)} className="self-start" accessibilityRole="link">
          <Text className="text-body-lg font-semibold text-primary underline">
            {t('contactTab.emailValue')}
          </Text>
        </Pressable>
      </ContactCard>

      <ContactCard iconName="clock-outline" title={t('contactTab.hoursCardTitle')}>
        <Text className="text-body-lg text-fg-secondary">{t('contactTab.hoursValue')}</Text>
      </ContactCard>

      <ContactCard iconName="map-marker-outline" title={t('contactTab.locationCardTitle')}>
        <Text className="text-body-lg text-fg-secondary">{t('contactTab.addressLine')}</Text>
        <Text className="text-body-lg text-fg-secondary">{t('contactTab.postalLine')}</Text>
      </ContactCard>

      <ContactCard iconName="share-variant-outline" title={t('contactTab.socialTitle')}>
        <View className="flex-row flex-wrap gap-2">
          <SocialPress onPress={() => openUrl(NbeContactLinks.facebook)} icon="facebook" label={t('contactTab.facebookLabel')} />
          <SocialPress onPress={() => openUrl(NbeContactLinks.youtube)} icon="youtube" label={t('contactTab.youtubeLabel')} />
        </View>
      </ContactCard>
    </ScrollView>
  );
}

function SocialPress({ onPress, icon, label }: { onPress: () => void; icon: IconName; label: string }) {
  const { colors } = useAppTheme();
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-1 rounded-md border border-border bg-surface px-4 py-2"
      accessibilityRole="link">
      <MaterialCommunityIcons name={icon} size={20} color={colors.primary} />
      <Text className="text-body-lg font-semibold text-fg-secondary">{label}</Text>
    </Pressable>
  );
}
