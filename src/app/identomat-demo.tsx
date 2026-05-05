import { router } from 'expo-router';

import { IdentomatDemoScreen } from '@/components/identomat/identomat-demo-screen';

export default function IdentomatDemoRoute() {
  return <IdentomatDemoScreen onBack={() => router.back()} />;
}
