export const BASE_URL = "https://eps-gateway-testing.nbe.gov.ge";

// ── Paths ─────────────────────────────────────────────────────────────────────
export const ApiPaths = {
  // Auth
  sessions: "/um-portal/v1/sessions",
  logout: "/um-portal/v1/sessions/logout",
  otpSend: "/um-portal/v1/otp/send",
  otpVerify: "/um-portal/v1/otp/verify",
  // Cyber-security review moved the OTP code out of the URL path and into the
  // request body (PATCH /sessions/otp with `{ data: { otp } }`).
  sessionOtpVerify: "/um-portal/v1/sessions/otp",
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
  // Legal entities the signed-in physical user can switch to.
  legalEntities: "/um-portal/v1/legal-entities",
  legalEntityById: (id: number | string) =>
    `/um-portal/v1/legal-entities/${id}`,

  // WebAuthn / Passkey — device trust (გასანდოება)
  // Registration flow is authenticated; login flow is public (no session yet).
  webauthnChallenge: "/um-portal/v1/webauthn/challenge",
  webauthnRegister: "/um-portal/v1/webauthn/register",
  webauthnLoginChallenge: "/um-portal-pub/v1/webauthn/challenge",
  webauthnLogin: "/um-portal-pub/v1/webauthn/login",
  // Trusted-device management (authenticated). DELETE revokes server-side
  // (sets revokedDate) — local cleanup alone would leave the credential active.
  // NOTE the backend's misspelling: every route uses "credintial" (with an `i`),
  // NOT "credential". The LIST is plural (`/webauthn/credintials`) and a
  // single-credential op is SINGULAR, appending the record's own `id`
  // (`/webauthn/credintial/{id}`) — NOT the Base64URL credentialId. Confirmed by
  // backend (Vako); `credential/{id}` 500s with "No static resource".
  webauthnCredentials: "/um-portal/v1/webauthn/credintials",
  webauthnCredentialById: (id: string | number) =>
    `/um-portal/v1/webauthn/credintial/${id}`,

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
  appExtraInfo: (appId: number | string) =>
    `/external-apps-portal/v1/apps/${appId}/dtls`,
  // EPS-FILE-API (separate host) — stream/download a status file.
  epsFilesStream: "/file-portal/v1/eps/files/stream",

  // EPS-FACT-API — ფაქტების კონსტატაცია / statement of facts (gateway maps `fact-portal` → fact-api `/portal`)
  // Create (ჩაწერა, POST) and update (რედაქტირება, PUT …/{id}) a statement —
  // mirrors the debtor-portal create/update pair. NOTE: confirm the request
  // schema with backend; see buildFactAppPayload.
  factApps: "/fact-portal/v1/apps",
  factAppsSearch: "/fact-portal/v1/apps/search",
  factAppById: (id: number | string) => `/fact-portal/v1/apps/${id}`,
  factAppPersons: (appId: number | string) =>
    `/fact-portal/v1/persons/app/${appId}`,
  // ოქმი tab — proceeding status(es) for a statement (usually a single "105"
  // status) and its downloadable files. Bearer-only, through the gateway.
  factAppStatus: (appId: number | string) =>
    `/fact-portal/v1/app/${appId}/status`,
  factStatusGetFiles: "/fact-portal/v1/status/get-files",
  // EPS-FILE-API (through the gateway) — stream/download a protocol file.
  // NOTE: mirrors `epsFilesStream` / `debtorFilesStream`; confirm the exact
  // `fact` segment with backend once a token is available to test download.
  factFilesStream: "/file-portal/v1/fact/files/stream",

  // EPS-DEBTOR-API — debtor registry applications (gateway maps `debtor-portal` → debtor-api `/portal`)
  debtorApps: "/debtor-portal/v1/apps",
  debtorAppsSearch: "/debtor-portal/v1/apps/search",
  debtorAppById: (id: number | string) => `/debtor-portal/v1/apps/${id}`,
  debtorAppFiles: (appId: number | string) =>
    `/debtor-portal/v1/app/${appId}/file`,
  debtorAppPayments: (appId: number | string) =>
    `/debtor-portal/v1/payments/app/${appId}`,
  debtorFilesStream: "/file-portal/v1/debtor/files/stream",
  debtorAppPersons: (appId: number | string) =>
    `/debtor-portal/v1/persons/app/${appId}`,

  // EPS-MONEY-API
  debtorMoney: (appId: number | string) =>
    `/money-portal/v1/reg-money/debtor/app/${appId}`,
  creditorMoney: (appId: number | string) =>
    `/money-portal/v1/reg-money/creditor/app/${appId}`,

  // EPS-PAYMENT-API — ჩარიცხული თანხები (credited amounts on the funds sub-tab)
  appPaymentsByType: "/payment-portal-pub/v1/payments/by-app-and-app-prsn-type",
  // EPS-TRANSFER-API — გადარიცხვები (transfers on the funds sub-tab)
  appTransfers: (appId: number | string) =>
    `/transfer-portal-pub/v1/schemas/app/${appId}`,

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
  countUnread: "/notif-portal/v1/notifications/count-unread",
  search: "/notif-portal/v1/notifications/search",
  markAsRead: "/notif-portal/v1/notifications/mark-as-read",
  pushDevice: "/notif-portal/v1/push-notifications/device",
  pushPreference: "/notif-portal/v1/push-notifications/preference",
  pushDeactivate: "/notif-portal/v1/push-notifications/devices/deactivate",
  // Registers this install's Expo push token so the backend can deliver
  // remote pushes via https://exp.host/--/api/v2/push/send.
  registerDevice: "/notif-portal/v1/notifications/register-device",
} as const;

// Last Expo push token successfully registered with the backend; used to skip
// re-registering the same token on every dashboard mount.
export const PushTokenSyncedStorageKey = "nbe_push_token_synced" as const;

// ── News portal — FAQ (ხშირად დასმული კითხვები) ───────────────────────────────
// News service reached through the gateway with the session bearer.
export const NewsApiPaths = {
  faqs: "/news-portal-pub/v1/faqs",
  faqById: (id: number | string) => `/news-portal-pub/v1/faqs/${id}`,
  faqCategories: "/news-portal-pub/v1/faq-categories",
  faqCategoryById: (id: number | string) =>
    `/news-portal-pub/v1/faq-categories/${id}`,
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
// Legal entity the user switched to from the profile; absent = acting as themselves.
export const LegalEntityIdHeader = "X-Legal-Entity-ID" as const;
export const ActiveLegalEntityStorageKey = "nbe_active_legal_entity" as const;
export const FaceIdEnabledStorageKey = "nbe_face_id_enabled" as const;
export const FaceIdCredentialsStorageKey = "nbe_face_id_credentials" as const;
// Passkey / device trust. The credential id is returned by /webauthn/register and
// is needed to start a passkey login challenge. The installation id is a stable
// per-install UUID the backend uses to identify the device.
export const PasskeyCredentialIdStorageKey = "nbe_passkey_credential_id" as const;
export const PasskeyInstallationIdStorageKey =
  "nbe_passkey_installation_id" as const;
export const PushEnabledStorageKeyPrefix = "nbe_push_enabled_" as const;
