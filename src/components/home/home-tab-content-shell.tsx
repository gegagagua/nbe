import type { PropsWithChildren } from "react";
import { View } from "react-native";

import { AppSafeArea } from "@/components/ui/app-safe-area";
import { useSessionUserProfile } from "@/hooks/use-session-user-profile";

import { HomeHeader } from "./home-header";

export function HomeTabContentShell({ children }: PropsWithChildren) {
  const { displayName } = useSessionUserProfile();

  return (
    <View className="flex-1 bg-bg">
      <AppSafeArea style={{ flex: 1 }}>
        <HomeHeader displayName={displayName} />
        {children}
      </AppSafeArea>
    </View>
  );
}
