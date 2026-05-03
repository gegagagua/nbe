import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { DebtorRegistryLayout, DebtorRegistryPalette } from '@/constants/debtor-registry';

import { debtorExtractRequestStyles as s } from './debtor-extract-request.styles';

type Props = {
  title: string;
  backA11y: string;
  onBack: () => void;
};

export function DebtorExtractSubheader({ title, backA11y, onBack }: Props) {
  return (
    <View style={s.subheader}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={backA11y}
        onPress={onBack}
        style={s.subheaderBack}
      >
        <MaterialCommunityIcons
          name="chevron-left"
          size={DebtorRegistryLayout.filterPanelIconSize}
          color={DebtorRegistryPalette.textPrimary}
        />
      </Pressable>
      <Text style={s.subheaderTitle}>{title}</Text>
    </View>
  );
}
