import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { DebtorRegistryPalette } from '@/constants/debtor-registry';

import { caseDetailInternalStyles as s } from './case-detail-internal.styles';
import { caseDetailPanelStyles as p } from './case-detail-panels.styles';

type Props = {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
};

export function CaseDetailAgencyAccordion({ title, open, onToggle, children }: Props) {
  return (
    <View style={p.panel}>
      <Pressable style={p.panelHeadRow} onPress={onToggle}>
        <Text style={s.primaryText}>{title}</Text>
        <MaterialCommunityIcons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={22}
          color={DebtorRegistryPalette.buttonBg}
        />
      </Pressable>
      {open ? <View>{children}</View> : null}
    </View>
  );
}
