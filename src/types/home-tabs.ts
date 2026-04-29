export type HomeTabId = 'home' | 'faq' | 'chat' | 'contact';

export type HomeSecondaryScreenProps = {
  title: string;
  description: string;
  points: readonly string[];
};

export type HomeFaqItem = {
  question: string;
  answer: string;
};
