export type RegisterTabKind = 'physical' | 'legal';

export type RegisterSegmentedTabsProps = {
  value: RegisterTabKind;
  onChange: (next: RegisterTabKind) => void;
};

export type RegisterScreenBodyProps = {
  onBack: () => void;
};
