import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { Card } from '@/components/ui/card';
import { useAppTheme } from '@/theme';

type Props = {
  fullName: string;
  subtitle: string;
  onViewInfo: () => void;
};

export function ProfileAccountCard({ fullName, subtitle, onViewInfo }: Props) {
  const { colors } = useAppTheme();

  return (
    <Card onPress={onViewInfo} padding="md" elevation="sm" className="rounded-2xl">
      <View className="flex-row items-center gap-3">
        <View className="h-14 w-14 items-center justify-center rounded-2xl bg-primary-subtle">
          <MaterialCommunityIcons name="account" size={28} color={colors.primary} />
        </View>
        <View className="flex-1">
          <Text numberOfLines={1} className="text-subtitle font-bold text-fg">
            {fullName}
          </Text>
          <Text numberOfLines={1} className="text-caption text-fg-muted">
            {subtitle}
          </Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={22} color={colors.textMuted} />
      </View>
    </Card>
  );
}
