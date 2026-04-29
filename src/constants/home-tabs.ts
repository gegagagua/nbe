import { FontSize, Spacing } from '@/constants/theme';

export const HomeTabsPalette = {
  activeBg: '#2b436c',
  activeText: '#ffffff',
  onBarInactive: 'rgba(255, 255, 255, 0.76)',
  onBarHighlight: '#6078a3',
  inactiveBg: '#dde5f2',
  inactiveText: '#2b436c',
  surface: '#f7f9fc',
  cardBorder: '#d8e0ee',
  bodyText: '#3f4f68',
} as const;

export const HomeTabsLayout = {
  tabBarRadius: Spacing.three,
  tabRadius: Spacing.two + Spacing.half,
  tabGap: Spacing.one,
  tabBarPadding: Spacing.one,
  contentTopPad: Spacing.three,
  contentBottomPad: Spacing.four,
  sectionGap: Spacing.two,
  infoCardRadius: Spacing.three,
  infoCardPad: Spacing.three,
  bulletGap: Spacing.one,
  iconSize: FontSize.xxl,
  titleSize: FontSize.xxl,
  bodySize: FontSize.xl,
  lineHeight: 24,
} as const;

export const HomeTabsCopy = {
  faqTitle: 'FAQ',
  faqDescription: 'ხშირად დასმულ კითხვებზე სწრაფი პასუხები.',
  faqPoints: [
    'როგორ შევქმნა განცხადება და სად ვნახო მისი სტატუსი.',
    'რომელი საბუთებია საჭირო რეგისტრაციისთვის.',
    'რა ვადაში ხდება განაცხადის დამუშავება.',
  ],
  chatTitle: 'Chat',
  chatDescription: 'ონლაინ მხარდაჭერა სამუშაო საათებში.',
  chatPoints: [
    'დაიწყე ჩატი ოპერატორთან ერთი დაჭერით.',
    'შეტყობინებები ინახება საუბრის ისტორიაში.',
    'მიიღე სტატუსის განახლება რეალურ დროში.',
  ],
  contactTitle: 'Contact',
  contactDescription: 'საკონტაქტო არხები დამატებითი დახმარებისთვის.',
  contactPoints: [
    'ცხელი ხაზი: +995 32 2 405 405',
    'ელფოსტა: info@nbe.gov.ge',
    'მისამართი: თბილისი, დავით აღმაშენებლის გამზირი',
  ],
} as const;
