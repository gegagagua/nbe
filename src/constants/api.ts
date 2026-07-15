export const BASE_URL = "https://eps-gateway-testing.nbe.gov.ge";

// ── Paths ─────────────────────────────────────────────────────────────────────
export const ApiPaths = {
  // Auth
  sessions: "/um-portal/v1/sessions",
  logout: "/um-portal/v1/sessions/logout",
  otpSend: "/um-portal/v1/otp/send",
  otpVerify: "/um-portal/v1/otp/verify",
  sessionOtpVerify: (otp: string | number) =>
    `/um-portal/v1/sessions/otp/${otp}`,
  passwordReset: "/um-portal/v1/password/reset",

  // Public (unauthenticated)
  usersCreate: "/um-portal-pub/v1/users",
  usersVerifyPhone: "/um-portal-pub/v1/users/verification/phone",
  usersVerificationCheck: "/um-portal-pub/v1/users/verification/check",
  usersResetPassword: "/um-portal-pub/v1/users/reset-password",

  // Authenticated user profile
  usersMe: "/um-portal/v1/users/me",
  usersMeUpdate: "/um-portal/v1/users",
  usersChangePhone: "/um-portal/v1/users/phone",
  passwordGhange: "/um-portal/v1/users/password",

  // EPS-MONEY-API — public guest payment search
  paymentInfo: "/payment-portal-pub/v1/payments/info",
  paymentBogIntent: "/payment-portal-pub/v1/payments/bog/intents",
  paymentBogIntentSyncStatus: (id: number | string) =>
    `/payment-portal-pub/v1/payments/bog/intents/${id}/sync-status`,

  // EPS-API — cases
  appsSearch: "/eps-portal/v1/apps/search",
  appById: (id: number | string) => `/eps-portal/v1/apps/${id}`,
  appStatuses: (appId: number | string) =>
    `/eps-portal/v1/app/${appId}/statuses`,
  appStatusFiles: "/eps-portal/v1/app/statuses/get-files",
  appPersons: (appId: number | string) => `/eps-portal/v1/persons/app/${appId}`,
  appDemands: (appId: number | string) => `/eps-portal/v1/demands/app/${appId}`,
  // EPS-FILE-API (separate host) — stream/download a status file.
  epsFilesStream: "/file-portal/v1/eps/files/stream",

  // EPS-DEBTOR-API — debtor registry applications (gateway maps `debtor-portal` → debtor-api `/portal`)
  debtorApps: "/debtor-portal/v1/apps",
  debtorAppsSearch: "/debtor-portal/v1/apps/search",
  debtorAppById: (id: number | string) => `/debtor-portal/v1/apps/${id}`,

  // EPS-MONEY-API
  debtorMoney: (appId: number | string) =>
    `/money-portal/v1/reg-money/debtor/app/${appId}`,
  creditorMoney: (appId: number | string) =>
    `/money-portal/v1/reg-money/creditor/app/${appId}`,

  // EPS-INSTALLMENT-API
  installmentById: (id: number | string) =>
    `/installment-portal/v1/installments/app/${id}`,
  installmentPayments:
    "/installment-portal/v1/installments/payment/by-installment-id",

  // EPS-EAUCTION-API
  lotsByAppId: "/eauction-portal/v1/lots/by-app-id",

  // EPS-MIA-API
  miaInfoRests: "/mia-portal/v1/info-rests/get-all",
  miaProperties: "/mia-portal/v1/properties/get-all",

  // EPS-SSA-API
  ssaRequests: "/ssa-portal/v1/ssa-requests/by-app-id",

  // EPS-NAPR-API
  landregInfos: "/napr-portal/v1/landreg/infos/by-app-id",
  landregRealEstates: "/napr-portal/v1/landreg/real-estates/by-app-id",
  enregInfos: "/napr-portal/v1/enreg/infos/by-app-id",
  enregActiveShares: "/napr-portal/v1/enreg/active-shares/by-app-id",
} as const;

// ── Notifications ─────────────────────────────────────────────────────────────
export const NotificationsApiPaths = {
  countUnread: "/um-portal/v1/notifications/count-unread",
} as const;

// ── Legacy keys kept for backward compatibility ───────────────────────────────
export const ApiConfig = {
  baseUrl: BASE_URL,
  sessionsPath: ApiPaths.sessions,
  otpSendPath: ApiPaths.otpSend,
  otpVerifyPath: ApiPaths.otpVerify,
  passwordResetPath: ApiPaths.passwordReset,
  notificationsCountUnreadPath: NotificationsApiPaths.countUnread,
} as const;

export const SessionStorageKey = "nbe_session_token" as const;
export const SessionUserProfileStorageKey = "nbe_session_user_profile" as const;
export const FaceIdEnabledStorageKey = "nbe_face_id_enabled" as const;
export const FaceIdCredentialsStorageKey = "nbe_face_id_credentials" as const;
