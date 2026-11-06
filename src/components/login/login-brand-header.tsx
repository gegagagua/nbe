import Logo from '@/assets/images/logo.png';
import { Platform, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Image } from 'expo-image';

export function LoginBrandHeader() {
  const { t } = useTranslation();

  return (
    <View className="mb-6 flex-row items-center justify-center gap-4">
      <Image
        source={Logo}
        style={{ width: 52, height: 52 }}
        contentFit="contain"
        cachePolicy="memory-disk"
        priority="high"
        transition={0}
        accessibilityLabel={t('login.brandGeo')}
      />
      <View>
        <Text
          className="text-label font-bold uppercase text-primary"
          style={{ letterSpacing: 0.6 }}
          numberOfLines={3}>
          {t('login.brandGeo')}
        </Text>
        <View className="my-1 h-px self-stretch bg-danger" />
        <Text
          className="text-label font-bold text-primary"
          style={{ letterSpacing: Platform.select({ ios: 0.35, default: 0 }) }}
          numberOfLines={2}>
          {t('login.brandEn')}
        </Text>
      </View>
    </View>
  );
}
