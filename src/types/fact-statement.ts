export type FactStatementPhase = "form" | "recorded" | "payment" | "submit";

/** საფასური — working hours (200 GEL) vs non-working hours (300 GEL). */
export type FactFeeKind = "working" | "nonworking";

/** მესაკუთრე — not specified / natural person / legal entity. */
export type FactOwnerKind = "none" | "physical" | "legal";

export type FactStatementPaymentMethod =
  | "card"
  | "bankTransfer"
  | "applePay"
  | "googlePay";

export type FactStatementPaymentOptionLabelKey =
  | "facts.stMethodCard"
  | "facts.stMethodBankTransfer"
  | "facts.stMethodApplePay"
  | "facts.stMethodGooglePay";

export type FactStatementPaymentOption = {
  id: FactStatementPaymentMethod;
  labelKey: FactStatementPaymentOptionLabelKey;
  icon: string;
};

export type FactStatementForm = {
  /** ორგანიზაცია — bureau value (required). */
  organization: string;
  // განმცხადებელი (auto-filled, editable)
  applicantFirstName: string;
  applicantLastName: string;
  applicantPersonalId: string;
  applicantAddress: string;
  applicantPhone: string;
  applicantEmail: string;
  // საფასური
  fee: FactFeeKind;
  // ფაქტის დადგენის თარიღი
  factDate: string; // YYYY-MM-DD
  factHourFrom: string; // "HH:00" | ""
  factHourTo: string; // "HH:00" | ""
  // ფაქტების დადგენის ადგილი
  propertyType: string; // required
  cadCode: string; // optional
  placeAddress: string; // required
  // მესაკუთრე
  ownerKind: FactOwnerKind;
  ownerPersonalId: string;
  ownerFirstName: string;
  ownerLastName: string;
  ownerLegalCode: string;
  ownerLegalName: string;
  ownerAddress: string;
  // მოთხოვნა
  request: string; // required
};

export const emptyFactStatementForm = (): FactStatementForm => ({
  organization: "",
  applicantFirstName: "",
  applicantLastName: "",
  applicantPersonalId: "",
  applicantAddress: "",
  applicantPhone: "",
  applicantEmail: "",
  fee: "working",
  factDate: "",
  factHourFrom: "",
  factHourTo: "",
  propertyType: "",
  cadCode: "",
  placeAddress: "",
  ownerKind: "none",
  ownerPersonalId: "",
  ownerFirstName: "",
  ownerLastName: "",
  ownerLegalCode: "",
  ownerLegalName: "",
  ownerAddress: "",
  request: "",
});
