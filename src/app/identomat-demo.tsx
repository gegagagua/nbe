import { router, useLocalSearchParams } from 'expo-router';

import { IdentomatDemoScreen } from '@/components/identomat/identomat-demo-screen';
import { IDENTOMAT_WIDGET_URL } from '@/constants/identomat';

export default function IdentomatDemoRoute() {
  const params = useLocalSearchParams<{ mode?: string }>();
  const sourceUrl = params.mode === 'guest' ? IDENTOMAT_WIDGET_URL : undefined;
  return <IdentomatDemoScreen onBack={() => router.back()} sourceUrl={sourceUrl} />;
}
