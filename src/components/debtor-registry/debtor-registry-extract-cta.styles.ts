import { StyleSheet } from 'react-native';

import {
  DebtorRegistryLayout,
  DebtorRegistryPalette,
  DebtorRegistryTypography,
} from '@/constants/debtor-registry';
import { LoginInteraction } from '@/constants/login';
import { Space } from '@/constants/theme';

export const debtorRegistryExtractCtaStyles = StyleSheet.create({
  wrap: {
    marginTop: Space.large,
  },
  press: {
    minHeight: DebtorRegistryLayout.extractCtaMinHeight,
    borderRadius: DebtorRegistryLayout.buttonRadius,
    backgroundColor: DebtorRegistryPalette.buttonBg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Space.large,
    paddingHorizontal: Space.medium,
  },
  pressPressed: {
    opacity: LoginInteraction.pressedOpacity,
  },
  label: {
    fontSize: DebtorRegistryTypography.title,
    fontWeight: '700',
    color: DebtorRegistryPalette.buttonText,
    textAlign: 'center',
  },
});
