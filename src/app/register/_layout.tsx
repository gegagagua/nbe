import { Stack } from 'expo-router';

import { RegisterFlowProvider } from '@/components/register/register-flow-context';

// Each registration step is its own route so the iOS swipe-back gesture (and
// the native back) pops one step at a time instead of dropping the whole flow
// back to the auth page. The shared flow state is provided above the stack.
export default function RegisterLayout() {
  return (
    <RegisterFlowProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          animationDuration: 240,
          gestureEnabled: true,
        }}
      >
        {/* Once registration succeeds there's nothing to go back to, so the
            success step can't be swiped back into the Identomat step. */}
        <Stack.Screen name="success" options={{ gestureEnabled: false }} />
      </Stack>
    </RegisterFlowProvider>
  );
}
