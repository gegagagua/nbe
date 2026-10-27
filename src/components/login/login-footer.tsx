import Constants from 'expo-constants';
import { Platform, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

const appVersion = Constants.expoConfig?.version ?? '';

export function LoginFooter() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  // Without edge-to-edge, Android reports insets.bottom === 0, so the footer
  // text ends up sitting right on top of the system navigation bar. Give it a
  // larger floor on Android so it always has breathing room above the nav bar.
  const minBottomPad = Platform.OS === 'android' ? 16 : 8;
  const bottomPad = Math.max(insets.bottom, minBottomPad);

  return (
    <View
      className="w-full flex-row items-center justify-between gap-4 bg-primary px-6 pt-4"
      style={{ paddingBottom: bottomPad }}>
      <Text className="flex-1 text-label leading-[18px] text-on-primary">
        {t('login.footerLeft')}
      </Text>
      {appVersion ? (
        <Text className="text-label leading-[18px] text-on-primary opacity-70">{`v${appVersion}`}</Text>
      ) : null}
    </View>
  );
}
