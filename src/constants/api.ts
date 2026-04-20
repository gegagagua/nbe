export const ApiConfig = {
  baseUrl: 'https://nbe-eps-webapp.staging.cloud.gov.ge',
  sessionsPath: '/api/um/v1/sessions',
  debtorAppsSearchPath: '/api/debtor/v1/apps/search',
  debtorSearchPath: '/api/debtor/v1/debtors/search',
  epsAppsSearchPath: '/api/eps/v1/apps/search',
  notificationsCountUnreadPath: '/api/notif/v1/notifications/count-unread',
} as const;

export const SessionStorageKey = 'nbe_session_token' as const;

export const SessionUserProfileStorageKey = 'nbe_session_user_profile' as const;
