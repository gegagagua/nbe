import { HomeTabsCopy } from '@/constants/home-tabs';

import { HomeSecondaryScreen } from './home-secondary-screen';

export function HomeFaqScreen() {
  return (
    <HomeSecondaryScreen
      title={HomeTabsCopy.faqTitle}
      description={HomeTabsCopy.faqDescription}
      points={HomeTabsCopy.faqPoints}
    />
  );
}
