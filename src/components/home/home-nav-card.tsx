import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { Card } from '@/components/ui/card';
import { useAppTheme } from '@/theme';
import { listEntering } from '@/theme/transitions';
import type { HomeNavCardProps } from '@/types/home-dashboard';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export function HomeNavCard({
  item,
  onPress,
  fullWidth,
  index = 0,
}: HomeNavCardProps & { fullWidth?: boolean; index?: number }) {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const title = t(item.titleKey);
  const disabled = item.disabled === true;

  return (
    <Animated.View entering={listEntering(index)} className={fullWidth ? 'w-full' : 'w-[48%]'}>
      <Card
        onPress={onPress}
        disabled={disabled}
        padding="md"
        elevation="sm"
        accessibilityLabel={title}
        className="min-h-[132px] items-center justify-center rounded-2xl">
        <View
          className={`h-14 w-14 items-center justify-center rounded-xl ${disabled ? 'bg-fg-disabled' : 'bg-primary'}`}>
          <MaterialCommunityIcons
            name={item.icon as IconName}
            size={28}
            color={colors.onPrimary}
          />
        </View>
        <Text
          numberOfLines={2}
          className={`mt-3 text-center text-subtitle font-bold ${disabled ? 'text-fg-disabled' : 'text-fg'}`}>
          {title}
        </Text>
      </Card>
    </Animated.View>
  );
}
