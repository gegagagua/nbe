import { HomeContactScreen } from '@/components/home/home-contact-screen';
import { HomeTabContentShell } from '@/components/home/home-tab-content-shell';

export default function ContactTabRoute() {
  return (
    <HomeTabContentShell>
      <HomeContactScreen />
    </HomeTabContentShell>
  );
}
