// ── User Management ──────────────────────────────────────────────────────────
export const UmApiBase = "https://nbe-eps-um-api.staging.cloud.gov.ge";

// ── EPS-API (cases) ───────────────────────────────────────────────────────────
export const EpsApiBase = "https://nbe-eps-api.staging.cloud.gov.ge";

// ── EPS-MONEY-API ─────────────────────────────────────────────────────────────
export const EpsMoneyApiBase = "https://nbe-eps-money-api.staging.cloud.gov.ge";

// ── EPS-INSTALLMENT-API ───────────────────────────────────────────────────────
export const EpsInstallmentApiBase =
  "https://nbe-eps-installment-api.staging.cloud.gov.ge";

// ── EPS-EAUCTION-API ──────────────────────────────────────────────────────────
export const EpsEauctionApiBase =
  "https://nbe-eps-eauction-api.staging.cloud.gov.ge";

// ── EPS-MIA-API ───────────────────────────────────────────────────────────────
export const EpsMiaApiBase = "https://nbe-eps-mia-api.staging.cloud.gov.ge";

// ── EPS-SSA-API ───────────────────────────────────────────────────────────────
export const EpsSsaApiBase = "https://nbe-eps-ssa-api.staging.cloud.gov.ge";

// ── EPS-NAPR-API ──────────────────────────────────────────────────────────────
export const EpsNaprApiBase = "https://nbe-eps-napr-api.staging.cloud.gov.ge";

// ── Paths ─────────────────────────────────────────────────────────────────────
export const ApiPaths = {
  // Auth
  sessions: "/portal/v1/sessions",
  otpSend: "/portal/v1/otp/send",
  otpVerify: "/portal/v1/otp/verify",
  passwordReset: "/portal/v1/password/reset",

  // EPS-API — cases
  appsSearch: "/portal/v1/apps/search",
  appById: (id: number | string) => `/portal/v1/apps/${id}`,
  appStatuses: (appId: number | string) => `/portal/v1/app/${appId}/statuses`,
  appStatusFiles: "/portal/v1/app/statuses/get-files",
  appPersons: (appId: number | string) => `/portal/v1/persons/app/${appId}`,
  appDemands: (appId: number | string) => `/portal/v1/demands/app/${appId}`,

  // EPS-MONEY-API
  debtorMoney: (appId: number | string) =>
    `/portal/v1/reg-money/debtor/app/${appId}`,
  creditorMoney: (appId: number | string) =>
    `/portal/v1/reg-money/creditor/app/${appId}`,

  // EPS-INSTALLMENT-API
  installmentById: (id: number | string) => `/portal/v1/installments/${id}`,
  installmentPayments: "/portal/v1/installments/payment/by-installment-id",

  // EPS-EAUCTION-API
  lotsByAppId: "/portal/v1/lots/by-app-id",

  // EPS-MIA-API
  miaInfoRests: "/portal/v1/info-rests/get-all",
  miaProperties: "/portal/v1/properties/get-all",

  // EPS-SSA-API
  ssaRequests: "/portal/v1/ssa-requests/by-app-id",

  // EPS-NAPR-API
  landregInfos: "/portal/v1/landreg/infos/by-app-id",
  landregRealEstates: "/portal/v1/landreg/real-estates/by-app-id",
  enregInfos: "/portal/v1/enreg/infos/by-app-id",
  enregActiveShares: "/portal/v1/enreg/active-shares/by-app-id",
} as const;

// ── Notifications ─────────────────────────────────────────────────────────────
export const NotificationsApiPaths = {
  countUnread: "/portal/v1/notifications/count-unread",
} as const;

// ── Legacy keys kept for backward compatibility ───────────────────────────────
export const ApiConfig = {
  baseUrl: UmApiBase,
  sessionsPath: ApiPaths.sessions,
  otpSendPath: ApiPaths.otpSend,
  otpVerifyPath: ApiPaths.otpVerify,
  passwordResetPath: ApiPaths.passwordReset,
  notificationsCountUnreadPath: NotificationsApiPaths.countUnread,
} as const;

export const SessionStorageKey = "nbe_session_token" as const;
export const SessionUserProfileStorageKey = "nbe_session_user_profile" as const;
