import { Platform } from "react-native";

import type {
  FactFeeKind,
  FactStatementPaymentMethod,
  FactStatementPaymentOption,
} from "@/types/fact-statement";

/** საფასური — fixed service fee per time band (GEL). */
export const FactStatementFee: Record<FactFeeKind, number> = {
  working: 200,
  nonworking: 300,
};

/** ფაქტის დადგენის დრო — selectable hours ("00:00" … "23:00"). */
export const FactStatementHourOptions: string[] = Array.from(
  { length: 24 },
  (_, h) => `${String(h).padStart(2, "0")}:00`,
);

const WALLET: Record<"ios" | "android", FactStatementPaymentOption> = {
  ios: { id: "applePay", labelKey: "facts.stMethodApplePay", icon: "apple" },
  android: {
    id: "googlePay",
    labelKey: "facts.stMethodGooglePay",
    icon: "google",
  },
};

const COMMON: FactStatementPaymentOption[] = [
  { id: "card", labelKey: "facts.stMethodCard", icon: "credit-card-outline" },
  {
    id: "bankTransfer",
    labelKey: "facts.stMethodBankTransfer",
    icon: "bank-transfer",
  },
];

export function getFactStatementPaymentOptions(): FactStatementPaymentOption[] {
  const wallet =
    Platform.OS === "ios"
      ? [WALLET.ios]
      : Platform.OS === "android"
        ? [WALLET.android]
        : [];
  return [...COMMON, ...wallet];
}

export function defaultFactStatementPaymentMethod(): FactStatementPaymentMethod {
  return getFactStatementPaymentOptions()[0]?.id ?? "card";
}
