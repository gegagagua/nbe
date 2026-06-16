import { isGuestMode } from "@/lib/guest-mode";

import { CaseGuestFineScreen } from "./case-guest-fine-screen";
import { CaseLoggedInScreen } from "./case-logged-in-screen";

export function CaseScreen() {
  if (isGuestMode()) {
    return <CaseGuestFineScreen />;
  }
  return <CaseLoggedInScreen />;
}
