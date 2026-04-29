import { HomeTabsCopy } from '@/constants/home-tabs';

import { HomeSecondaryScreen } from './home-secondary-screen';

export function HomeContactScreen() {
  return (
    <HomeSecondaryScreen
      title={HomeTabsCopy.contactTitle}
      description={HomeTabsCopy.contactDescription}
      points={HomeTabsCopy.contactPoints}
    />
  );
}
