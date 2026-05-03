import type { ComponentProps, ReactNode } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { HomeTabsLayout, HomeTabsPalette } from '@/constants/home-tabs';
import { NbeContactLinks, NbeContactMailto, NbeContactPhoneRows } from '@/constants/nbe-contact-links';

import { homeContactScreenStyles as s } from './home-contact-screen.styles';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

function openUrl(href: string) {
  void Linking.openURL(href);
}

function ContactCard({ iconName, title, children }: { iconName: IconName; title: string; children: ReactNode }) {
  return (
    <View style={s.card}>
      <View style={s.cardHead}>
        <MaterialCommunityIcons name={iconName} size={HomeTabsLayout.iconSize} color={HomeTabsPalette.activeBg} />
        <Text style={s.cardTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

export function HomeContactScreen() {
  const { t } = useTranslation();

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.content}>
      <Text style={s.screenTitle}>{t('contactTab.screenTitle')}</Text>

      <ContactCard iconName="phone" title={t('contactTab.phoneCardTitle')}>
        <View style={s.phoneRowsWrap}>
          {NbeContactPhoneRows.map((row, index) => (
            <View key={row.tel} style={s.phoneRow}>
              <Text style={s.phoneRowLabel}>{t(row.labelKey)}</Text>
              <Pressable onPress={() => openUrl(row.tel)} style={s.phonePress} accessibilityRole="link">
                <Text style={index === 0 ? s.phoneValuePrimary : s.phoneValueSecondary}>{t(row.valueKey)}</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </ContactCard>

      <ContactCard iconName="email-outline" title={t('contactTab.emailCardTitle')}>
        <Pressable onPress={() => openUrl(NbeContactMailto)} style={s.linkPress} accessibilityRole="link">
          <Text style={s.linkText}>{t('contactTab.emailValue')}</Text>
        </Pressable>
      </ContactCard>

      <ContactCard iconName="clock-outline" title={t('contactTab.hoursCardTitle')}>
        <Text style={s.cardBody}>{t('contactTab.hoursValue')}</Text>
      </ContactCard>

      <ContactCard iconName="map-marker-outline" title={t('contactTab.locationCardTitle')}>
        <Text style={s.cardBody}>{t('contactTab.addressLine')}</Text>
        <Text style={s.cardBody}>{t('contactTab.postalLine')}</Text>
      </ContactCard>

      <ContactCard iconName="share-variant-outline" title={t('contactTab.socialTitle')}>
        <View style={s.socialRow}>
          <Pressable onPress={() => openUrl(NbeContactLinks.facebook)} style={s.socialPress} accessibilityRole="link">
            <MaterialCommunityIcons name="facebook" size={HomeTabsLayout.iconSize} color={HomeTabsPalette.activeBg} />
            <Text style={s.socialLabel}>{t('contactTab.facebookLabel')}</Text>
          </Pressable>
          <Pressable onPress={() => openUrl(NbeContactLinks.youtube)} style={s.socialPress} accessibilityRole="link">
            <MaterialCommunityIcons name="youtube" size={HomeTabsLayout.iconSize} color={HomeTabsPalette.activeBg} />
            <Text style={s.socialLabel}>{t('contactTab.youtubeLabel')}</Text>
          </Pressable>
        </View>
      </ContactCard>
    </ScrollView>
  );
}
