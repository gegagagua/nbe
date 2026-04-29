import { HomeFaqScreen } from '@/components/home/home-faq-screen';
import { HomeTabContentShell } from '@/components/home/home-tab-content-shell';

export default function FaqTabRoute() {
  return (
    <HomeTabContentShell>
      <HomeFaqScreen />
    </HomeTabContentShell>
  );
}
