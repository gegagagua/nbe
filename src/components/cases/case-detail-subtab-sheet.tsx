import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import type { CaseDetailInfoSub } from '@/types/case-detail-ui';

import { caseDetailInternalStyles as s } from './case-detail-internal.styles';
import { caseDetailModalStyles as m } from './case-detail-modal.styles';
import { caseDetailPanelStyles as p } from './case-detail-panels.styles';

type Opt = { key: CaseDetailInfoSub; label: string };

type Props = {
  visible: boolean;
  options: Opt[];
  onClose: () => void;
  onSelect: (key: CaseDetailInfoSub) => void;
};

export function CaseDetailSubtabSheet({ visible, options, onClose, onSelect }: Props) {
  const { t } = useTranslation();
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={m.scrimFill}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} accessibilityRole="button" />
        <View style={m.sheetStack}>
          <View style={p.panel}>
            <Text style={p.panelTitle}>{t('cases.detail.subtabPickerHint')}</Text>
            {options.map((o) => (
              <Pressable
                key={o.key}
                style={p.panelHeadRow}
                onPress={() => {
                  onSelect(o.key);
                  onClose();
                }}>
                <Text style={s.primaryText}>{o.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}
