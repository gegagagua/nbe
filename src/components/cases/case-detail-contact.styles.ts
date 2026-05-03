import { StyleSheet } from 'react-native';

import {
  DebtorRegistryLayout,
  DebtorRegistryPalette,
  DebtorRegistryTypography,
} from '@/constants/debtor-registry';
import { LoginPalette } from '@/constants/login';
import { Space } from '@/constants/theme';

export const caseDetailContactStyles = StyleSheet.create({
  closeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.extraSmall,
    alignSelf: 'flex-start',
    marginTop: Space.medium,
    paddingVertical: Space.small,
    paddingHorizontal: Space.medium,
    borderRadius: DebtorRegistryLayout.buttonRadius,
    borderWidth: 1,
    borderColor: LoginPalette.logoRed,
  },
  closeBtnText: {
    fontSize: DebtorRegistryTypography.label,
    fontWeight: '600',
    color: LoginPalette.logoRed,
  },
  contactRow: {
    paddingVertical: Space.small,
    borderBottomWidth: 1,
    borderBottomColor: DebtorRegistryPalette.panelBorder,
  },
  contactLabel: {
    fontSize: DebtorRegistryTypography.small,
    fontWeight: '700',
    color: DebtorRegistryPalette.textPrimary,
  },
  contactValue: {
    fontSize: DebtorRegistryTypography.body,
    color: DebtorRegistryPalette.textSecondary,
    marginTop: Space.extraSmall,
  },
});
