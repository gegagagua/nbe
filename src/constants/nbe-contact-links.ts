export const NbeContactLinks = {
  facebook: 'https://www.facebook.com/nbe.gov.ge',
  youtube: 'https://www.youtube.com/@national_bureau_of_enforcement',
} as const;

export const NbeContactMailto = 'mailto:info@nbe.gov.ge' as const;

export const NbeContactPhoneRows = [
  { tel: 'tel:+995322749649', labelKey: 'contactTab.phone1Label', valueKey: 'contactTab.phone1Value' },
  { tel: 'tel:+995322721118', labelKey: 'contactTab.phone2Label', valueKey: 'contactTab.phone2Value' },
  { tel: 'tel:+995322721118,2084', labelKey: 'contactTab.phone3Label', valueKey: 'contactTab.phone3Value' },
] as const;
