import { StyleSheet } from 'react-native';

import { CaseDetailUiPalette } from '@/constants/case-detail-ui';
import { Space } from '@/constants/theme';

export const caseDetailModalStyles = StyleSheet.create({
  scrimFill: {
    flex: 1,
    backgroundColor: CaseDetailUiPalette.modalScrim,
  },
  sheetStack: {
    flex: 1,
    paddingTop: Space.extraLarge * 4,
    paddingHorizontal: Space.medium,
  },
});
