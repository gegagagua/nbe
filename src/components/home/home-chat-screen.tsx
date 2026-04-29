import { HomeTabsCopy } from '@/constants/home-tabs';

import { HomeSecondaryScreen } from './home-secondary-screen';

export function HomeChatScreen() {
  return (
    <HomeSecondaryScreen
      title={HomeTabsCopy.chatTitle}
      description={HomeTabsCopy.chatDescription}
      points={HomeTabsCopy.chatPoints}
    />
  );
}
