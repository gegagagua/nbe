import type { PropsWithChildren } from "react";
import { View } from "react-native";

import { AppSafeArea } from "@/components/ui/app-safe-area";
import { useSessionUserProfile } from "@/hooks/use-session-user-profile";

import { HomeHeader } from "./home-header";
import { homeTabContentShellStyles } from "./home-tab-content-shell.styles";

export function HomeTabContentShell({ children }: PropsWithChildren) {
  const { displayName } = useSessionUserProfile();

  return (
    <View style={homeTabContentShellStyles.page}>
      <AppSafeArea style={homeTabContentShellStyles.body}>
        <HomeHeader displayName={displayName} />
        {children}
      </AppSafeArea>
    </View>
  );
}
