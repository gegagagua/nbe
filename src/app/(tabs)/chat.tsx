import { HomeChatScreen } from '@/components/home/home-chat-screen';
import { HomeTabContentShell } from '@/components/home/home-tab-content-shell';

export default function ChatTabRoute() {
  return (
    <HomeTabContentShell>
      <HomeChatScreen />
    </HomeTabContentShell>
  );
}
