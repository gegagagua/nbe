import { Text, View } from 'react-native';

import type { HomeSecondaryScreenProps } from '@/types/home-tabs';

import { homeSecondaryScreenStyles } from './home-secondary-screen.styles';

export function HomeSecondaryScreen({
  title,
  description,
  points,
}: HomeSecondaryScreenProps) {
  return (
    <View style={homeSecondaryScreenStyles.card}>
      <Text style={homeSecondaryScreenStyles.title}>{title}</Text>
      <Text style={homeSecondaryScreenStyles.description}>{description}</Text>
      {points.map((point) => (
        <Text key={point} style={homeSecondaryScreenStyles.bullet}>
          {`\u2022 ${point}`}
        </Text>
      ))}
    </View>
  );
}
