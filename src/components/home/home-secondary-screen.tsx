import { Text, View } from 'react-native';

import type { HomeSecondaryScreenProps } from '@/types/home-tabs';

export function HomeSecondaryScreen({
  title,
  description,
  points,
}: HomeSecondaryScreenProps) {
  return (
    <View className="gap-2 rounded-lg border border-border bg-surface p-4">
      <Text className="text-title font-bold text-fg">{title}</Text>
      <Text className="text-body-lg text-fg-secondary">{description}</Text>
      {points.map((point) => (
        <Text key={point} className="text-body-lg text-fg-secondary">
          {`• ${point}`}
        </Text>
      ))}
    </View>
  );
}
