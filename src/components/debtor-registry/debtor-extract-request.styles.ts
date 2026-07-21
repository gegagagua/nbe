import { StyleSheet } from 'react-native';

import {
  DebtorRegistryLayout,
  DebtorRegistryPalette,
  DebtorRegistryTypography,
} from '@/constants/debtor-registry';
import { LineHeight, Space, Spacing } from '@/constants/theme';

export const debtorExtractRequestStyles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: DebtorRegistryPalette.pageBg,
  },
  body: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Space.medium,
    paddingTop: Space.medium,
    paddingBottom: Spacing.five,
    gap: Space.large,
  },
  subheader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space.small,
    paddingHorizontal: Space.medium,
    paddingVertical: Space.medium,
    borderBottomWidth: 1,
    borderBottomColor: DebtorRegistryPalette.panelBorder,
    backgroundColor: DebtorRegistryPalette.cardBg,
  },
  subheaderBack: {
    padding: Space.small,
    marginLeft: -Space.small,
  },
  subheaderTitle: {
    flex: 1,
    fontSize: DebtorRegistryTypography.title,
    fontWeight: '700',
    color: DebtorRegistryPalette.textPrimary,
  },
  sectionCard: {
    backgroundColor: DebtorRegistryPalette.cardBg,
    borderRadius: DebtorRegistryLayout.cardRadius,
    borderWidth: 1,
    borderColor: DebtorRegistryPalette.cardBorder,
    padding: Space.medium,
    gap: Space.medium,
  },
  sectionTitle: {
    fontSize: DebtorRegistryTypography.body,
    fontWeight: '700',
    color: DebtorRegistryPalette.textPrimary,
  },
  fieldGap: {
    gap: Space.small,
  },
  fieldLabel: {
    fontSize: DebtorRegistryTypography.label,
    fontWeight: '600',
    color: DebtorRegistryPalette.textSecondary,
  },
  readonlyValue: {
    fontSize: DebtorRegistryTypography.input,
    color: DebtorRegistryPalette.textPrimary,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: DebtorRegistryPalette.inputBorder,
    backgroundColor: DebtorRegistryPalette.inputBg,
    borderRadius: DebtorRegistryLayout.buttonRadius,
    paddingHorizontal: Space.medium,
    paddingVertical: Space.small,
    fontSize: DebtorRegistryTypography.input,
    color: DebtorRegistryPalette.textPrimary,
    minHeight: DebtorRegistryLayout.inputHeight,
  },
  inputMultiline: {
    minHeight: DebtorRegistryLayout.inputHeight * 2,
    textAlignVertical: 'top',
  },
  inputDisabled: {
    backgroundColor: DebtorRegistryPalette.panelBg,
    color: DebtorRegistryPalette.textSecondary,
  },
  primaryButtonWrap: {
    marginTop: Space.small,
  },
  hintText: {
    fontSize: DebtorRegistryTypography.small,
    color: DebtorRegistryPalette.textMuted,
    lineHeight: LineHeight.comfortable,
  },
});
